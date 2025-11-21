package com.vendor_marketplace.services.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vendor_marketplace.dto.request.CouponRequest;
import com.vendor_marketplace.dto.request.UpdateCouponRequest;
import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.dto.response.CouponResponse;
import com.vendor_marketplace.entity.Cart;
import com.vendor_marketplace.entity.Coupon;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.exception.CouponValidityException;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.CartMapper;
import com.vendor_marketplace.mapper.CouponMapper;
import com.vendor_marketplace.repository.CartRepository;
import com.vendor_marketplace.repository.CouponRepository;
import com.vendor_marketplace.repository.UserRepository;
import com.vendor_marketplace.services.CouponService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RedisUtil redisUtil;

    @Override
    @Transactional
    public CartResponse applyCoupon(String jwt, String couponCode) {
        User user = userService.getUserFromJwt(jwt);
        Coupon coupon = couponRepository.findByCode(couponCode).orElseThrow(
                () -> new ResourceNotFoundException("Coupon not found with code " + couponCode + " || Coupon is invalid/expired/deleted")
        );

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(
                () -> new ResourceNotFoundException("You currently do not have any cart!")
        );

        validateCoupon(user, cart, coupon);

        log.info("Before applying coupon cart totalMrpPrice: {} totalSellingPrice: {} , totalDiscount: {}",
                cart.getTotalMrpPrice(), cart.getTotalSellingPrice(), cart.getDiscount());

        // STORE ORIGINAL PRICES BEFORE APPLYING COUPON
        if (cart.getOriginalSellingPrice() == null) {
            cart.setOriginalSellingPrice((int) cart.getTotalSellingPrice());
        }
        if (cart.getOriginalMrpPrice() == null) {
            cart.setOriginalMrpPrice(cart.getTotalMrpPrice());
        }

        // Calculate discount based on MRP
        double discountAmount = (cart.getTotalMrpPrice() * coupon.getDiscountInPercentage()) / 100;
        double finalPrice = cart.getTotalSellingPrice() - discountAmount;

        // Validate final price is not negative
        if (finalPrice < 0) {
            throw new CouponValidityException("Invalid discount calculation");
        }

        log.info("=== COUPON DEBUG ===");
        log.info("MRP Price: {}", cart.getTotalMrpPrice());
        log.info("Current Selling Price: {}", cart.getTotalSellingPrice());
        log.info("Coupon %: {}", coupon.getDiscountInPercentage());
        log.info("Discount Amount: {}", discountAmount);
        log.info("Final Price: {}", finalPrice);
        log.info("=====================");

        // Update cart with all coupon details
        cart.setTotalSellingPrice(finalPrice);
        cart.setDiscount(coupon.getDiscountInPercentage());
        cart.setCouponCode(coupon.getCode());
        cart.setCouponDiscountAmount((int) discountAmount); // Store the discount amount

        Cart saved = cartRepository.save(cart);

        // Mark coupon as used
        user.getUsedCoupons().add(coupon);
        userRepository.save(user);

        log.info("After applying coupon cart totalMrpPrice: {} totalSellingPrice: {} , totalDiscount: {}",
                saved.getTotalMrpPrice(), saved.getTotalSellingPrice(), saved.getDiscount());

        deleteUserCartCache(user.getId());

        return CartMapper.toCartResponse(saved);
    }

    private void validateCoupon(User user, Cart cart, Coupon coupon) {

        if (cart.getCartItems().isEmpty()) {
            throw new CouponValidityException("Your cart is empty");
        }

        // Check if cart has valid prices
        if (cart.getTotalMrpPrice() <= 0 || cart.getTotalSellingPrice() <= 0) {
            throw new CouponValidityException("Cart prices are not calculated properly. Please refresh your cart.");
        }
        double orderValue = cart.getCartItems().size();

        if (orderValue <= 0){
            throw new CouponValidityException("Your cart is empty currently");
        }

        if (coupon.getDiscountInPercentage() <= 0) {
            throw new CouponValidityException("Invalid discount percentage: " + coupon.getDiscountInPercentage() + ". Discount must be positive.");
        }

        if (coupon.getDiscountInPercentage() > 100) {
            throw new CouponValidityException("Discount percentage cannot exceed 100%");
        }

        // checking if user already used this coupon
        if (user.getUsedCoupons().contains(coupon)) {
            throw new CouponValidityException("Coupon is already used");
        }

        // checking minimum order value
        if (orderValue < coupon.getMinimumOrderValue()) {
            throw new CouponValidityException("Minimum order value for this coupon is: " + coupon.getMinimumOrderValue());
        }

        // checking validity period & status
        if (!coupon.isActive()) {
            throw new CouponValidityException("Coupon is inactive");
        }
        if (LocalDateTime.now().isBefore(coupon.getStartDate())) {
            throw new CouponValidityException("Coupon is not yet active. Starts at: " + coupon.getStartDate().format(DateTimeFormatter.ofPattern("EEE, MMM dd, yyyy hh:mm a")));
        }
        if (LocalDateTime.now().isAfter(coupon.getEndDate())) {
            throw new CouponValidityException("Coupon has expired. Ended at: " + coupon.getEndDate().format(DateTimeFormatter.ofPattern("EEE, MMM dd, yyyy hh:mm a")));
        }

        double discount = cart.getDiscount();

        if (discount >= coupon.getDiscountInPercentage()) {
            throw new CouponValidityException(
                    String.format("You're already getting %d%% discount from sellers, which is better than this %d%% coupon",
                            (int) discount,
                            (int) coupon.getDiscountInPercentage())

            );
        }
    }


    @Transactional
    @Override
    public CartResponse removeCoupon(String jwt, String couponCode) {

        User user = userService.getUserFromJwt(jwt);

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(
                () -> new ResourceNotFoundException("You currently do not have any cart!")
        );

        // Check if a coupon is actually applied and matches
        if (cart.getCouponCode() == null || !cart.getCouponCode().equals(couponCode)) {
            throw new ResourceNotFoundException("No coupon applied with code: " + couponCode);
        }

        Coupon coupon = couponRepository.findByCode(couponCode).orElseThrow(
                () -> new ResourceNotFoundException("Coupon not found with code " + couponCode)
        );

        log.info("Before removing coupon cart totalMrpPrice: {} totalSellingPrice: {}",
                cart.getTotalMrpPrice(), cart.getTotalSellingPrice());

        // FIXED: RESTORE ORIGINAL PRICES instead of applying discount again
        if (cart.getOriginalSellingPrice() != null) {
            cart.setTotalSellingPrice(cart.getOriginalSellingPrice());
        }

        // Recalculate discount based on original prices
        if (cart.getOriginalMrpPrice() != null && cart.getOriginalSellingPrice() != null) {
            double originalDiscount = calculateDiscountPercentage(cart.getOriginalMrpPrice(), cart.getOriginalSellingPrice());
            cart.setDiscount(originalDiscount);
        } else {
            // Fallback: recalculate from cart items
            double recalculatedDiscount = calculateDiscountPercentage(cart.getTotalMrpPrice(), (int) cart.getTotalSellingPrice());
            cart.setDiscount(recalculatedDiscount);
        }

        // Clear all coupon-related fields
        cart.setCouponCode(null);
        cart.setCouponDiscountAmount(null);
        cart.setOriginalSellingPrice(null);
        cart.setOriginalMrpPrice(null);

        Cart updatedCart = cartRepository.save(cart);

        // Remove from used coupons
        user.getUsedCoupons().remove(coupon);
        userRepository.save(user);

        deleteUserCartCache(user.getId());

        log.info("After removing coupon cart totalMrpPrice: {} totalSellingPrice: {}",
                updatedCart.getTotalMrpPrice(), updatedCart.getTotalSellingPrice());

        return CartMapper.toCartResponse(updatedCart);
    }

    private double calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) return 0;
        double discountAmount = mrpPrice - sellingPrice;
        return (discountAmount / mrpPrice) * 100;
    }

    @Override
    public CouponResponse findCouponById(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId).orElseThrow(
                () -> new ResourceNotFoundException("Coupon not found with id: " + couponId)
        );

        return CouponMapper.toCouponResponse(coupon);
    }

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest couponRequest) {

        if (couponRepository.existsByCode(couponRequest.getCode())) {
            throw new CouponValidityException("Coupon code is already in used!");
        }

        Coupon coupon = Coupon.builder()
                .code(couponRequest.getCode())
                .discountInPercentage(couponRequest.getDiscountInPercentage())
                .startDate(couponRequest.getStartDate())
                .endDate(couponRequest.getEndDate())
                .minimumOrderValue(couponRequest.getMinimumOrderValue())
                .isActive(couponRequest.getIsActive())
                .build();

        redisUtil.deleteCouponCache();
        return CouponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Override
    public List<CouponResponse> findAllCoupons(String couponStatus) {
        List<Coupon> couponList;

        String cacheKey;


        if (couponStatus == null || couponStatus.isBlank()) {

            cacheKey = RedisUtil.allCoupon("all");
            List<CouponResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<CouponResponse>>() {
            });

            if (cachedResponse != null && !cachedResponse.isEmpty()) {
                return cachedResponse;
            }
            log.info("Fetching coupons from DB for status: {}", "all");

            couponList = couponRepository.findAll();
        } else {
            switch (couponStatus.toUpperCase()) {
                case "ACTIVE" -> {
                    cacheKey = RedisUtil.allCoupon("active");
                    List<CouponResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<CouponResponse>>() {
                    });
                    if (cachedResponse != null && !cachedResponse.isEmpty()) {
                        return cachedResponse;
                    }
                    log.info("Fetching coupon from DB for status: {}", couponStatus);

                    couponList = couponRepository.findByIsActive(true);
                }
                case "INACTIVE" -> {
                    cacheKey = RedisUtil.allCoupon("inactive");
                    List<CouponResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<CouponResponse>>() {
                    });
                    if (cachedResponse != null && !cachedResponse.isEmpty()) {
                        return cachedResponse;
                    }
                    log.info("Fetching coupons from DB for status: {}", couponStatus);

                    couponList = couponRepository.findByIsActive(false);
                }
                default -> {
                    cacheKey = RedisUtil.allCoupon("all");
                    List<CouponResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<CouponResponse>>() {
                    });
                    if (cachedResponse != null && !cachedResponse.isEmpty()) {
                        return cachedResponse;
                    }
                    log.info("Fetching coupons from DB for status: {}", "all");
                    couponList = couponRepository.findAll();
                } // fallback
            }
        }

        List<CouponResponse> response = couponList.stream()
                .map(CouponMapper::toCouponResponse)
                .collect(Collectors.toList());

        redisUtil.saveToRedis(cacheKey, response, RedisUtil.FIVE_DAYS_CACHE_TTL);

        return response;
    }


    @Override
    @Transactional
    public void deleteCoupon(Long couponId) {

        Coupon coupon = couponRepository.findById(couponId).orElseThrow(
                () -> new ResourceNotFoundException("Coupon not found with id: " + couponId)
        );

        redisUtil.deleteCouponCache();
        couponRepository.delete(coupon);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Long couponId, UpdateCouponRequest couponRequest) {

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + couponId));

        Optional.ofNullable(couponRequest.getCode())
                .ifPresent(coupon::setCode);

        Optional.ofNullable(couponRequest.getIsActive())
                .ifPresent(coupon::setActive);

        Optional.ofNullable(couponRequest.getDiscountInPercentage())
                .ifPresent(coupon::setDiscountInPercentage);

        Optional.ofNullable(couponRequest.getMinimumOrderValue())
                .ifPresent(coupon::setMinimumOrderValue);

        Optional.ofNullable(couponRequest.getStartDate())
                .ifPresent(coupon::setStartDate);

        Optional.ofNullable(couponRequest.getEndDate())
                .ifPresent(coupon::setEndDate);

        couponRepository.save(coupon);
        redisUtil.deleteCouponCache();
        return CouponMapper.toCouponResponse(coupon);
    }

    private void deleteUserCartCache(Long id){
        String cacheKey = RedisUtil.userCart(id);
        redisUtil.deleteFromRedis(cacheKey);
    }

}
