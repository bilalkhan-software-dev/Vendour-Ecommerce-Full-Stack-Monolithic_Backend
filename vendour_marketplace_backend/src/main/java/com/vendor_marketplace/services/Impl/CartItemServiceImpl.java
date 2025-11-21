package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.request.UpdateCartItemRequest;
import com.vendor_marketplace.dto.response.CartItemResponse;
import com.vendor_marketplace.entity.Cart;
import com.vendor_marketplace.entity.CartItem;
import com.vendor_marketplace.entity.Coupon;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.CartItemMapper;
import com.vendor_marketplace.repository.CartItemRepository;
import com.vendor_marketplace.repository.CartRepository;
import com.vendor_marketplace.repository.CouponRepository;
import com.vendor_marketplace.services.CartItemService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.utils.CommonUtil;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

import static com.vendor_marketplace.utils.CommonUtil.calculateDiscountPercentage;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartItemServiceImpl implements CartItemService {

    private final UserService userService;
    private final CartItemRepository cartItemRepository;
    private final RedisUtil redisUtil;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;


    @Override
    @Transactional
    public CartItemResponse updateCartItem(String jwt, Long cartItemId, UpdateCartItemRequest cartItemRequest) {
        String cacheKey = RedisUtil.cartItem(cartItemId);

        User user = userService.getUserFromJwt(jwt);
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(
                () -> new ResourceNotFoundException("Cart Item not found with id " + cartItemId)
        );

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can't update cart item with different user id");
        }

        Cart cart = cartItem.getCart();

        // Store coupon info before modification
        String existingCouponCode = cart.getCouponCode();
        Integer originalSellingPrice = cart.getOriginalSellingPrice();
        boolean hadCoupon = existingCouponCode != null;

        // Update cart item
        cartItem.setQuantity(cartItemRequest.getQuantity());
        cartItem.setMrpPrice(cartItem.getQuantity() * cartItem.getProduct().getMrpPrice());
        cartItem.setSellingPrice(cartItem.getQuantity() * cartItem.getProduct().getSellingPrice());

        CartItem updatedCartItem = cartItemRepository.save(cartItem);

        // Update cart totals
        updateCartTotals(cart);
        cartRepository.save(cart);

        // Reapply coupon if it existed
        if (hadCoupon) {
            log.info("Reapplying coupon after cart item update: {}", existingCouponCode);
            reapplyCoupon(jwt, cart, existingCouponCode, originalSellingPrice);
        }

        // Clear cache
        String userCartCacheKey = RedisUtil.userCart(user.getId());
        redisUtil.deleteFromRedis(userCartCacheKey);

        CartItemResponse cartItemResponse = CartItemMapper.toCartItemResponse(updatedCartItem);
        redisUtil.saveToRedis(cacheKey, cartItemResponse, RedisUtil.ONE_DAY_CACHE_TTL);

        return cartItemResponse;
    }

    @Override
    @Transactional
    public void removeCartItem(String jwt, Long cartItemId) {
        String cacheKey = RedisUtil.cartItem(cartItemId);
        User user = userService.getUserFromJwt(jwt);
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(
                () -> new ResourceNotFoundException("Cart Item not found with id " + cartItemId)
        );

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can't remove cart item with different user id");
        }

        Cart cart = cartItem.getCart();

        // Store coupon info before removal
        String existingCouponCode = cart.getCouponCode();
        Integer originalSellingPrice = cart.getOriginalSellingPrice();
        boolean hadCoupon = existingCouponCode != null;

        // Remove cart item
        cartItemRepository.delete(cartItem);

        // Update cart totals after removal
        updateCartTotals(cart);
        cartRepository.save(cart);

        // Reapply coupon if it existed and cart is not empty
        if (hadCoupon && !cart.getCartItems().isEmpty()) {
            log.info("Reapplying coupon after cart item removal: {}", existingCouponCode);
            reapplyCoupon(jwt, cart, existingCouponCode, originalSellingPrice);
        } else if (hadCoupon && cart.getCartItems().isEmpty()) {
            // If cart becomes empty after removal, clear coupon
            log.info("Cart is empty after removal - clearing coupon: {}", existingCouponCode);
            clearCartCoupon(cart);
        }

        // Clear cache
        String userCacheKey = RedisUtil.userCart(user.getId());
        redisUtil.deleteFromRedis(userCacheKey);
        redisUtil.deleteFromRedis(cacheKey);
    }

    @Override
    public CartItemResponse findCartItemById(Long cartItemId) {

        String cacheKey = RedisUtil.cartItem(cartItemId);

        CartItemResponse cachedResponse = redisUtil.get(cacheKey, CartItemResponse.class);
        if (cachedResponse != null) {
            return cachedResponse;
        }


        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(
                () -> new ResourceNotFoundException("Cart Item not found with id " + cartItemId)
        );
        CartItemResponse cartItemResponse = CartItemMapper.toCartItemResponse(cartItem);

        redisUtil.saveToRedis(cacheKey,cartItemResponse,RedisUtil.ONE_DAY_CACHE_TTL);
        return cartItemResponse;
    }

    /**
     * Reapply coupon after cart changes
     */
    private void reapplyCoupon(String jwt, Cart cart, String couponCode, Integer originalSellingPrice) {
        try {
            Coupon coupon = couponRepository.findByCode(couponCode).orElse(null);
            if (coupon == null) {
                log.warn("Coupon {} not found for reapplication", couponCode);
                clearCartCoupon(cart);
                return;
            }

            User user = userService.getUserFromJwt(jwt);

            // Validate coupon is still valid
            if (!isCouponStillValid(user, cart, coupon)) {
                log.warn("Coupon {} is no longer valid after cart modification", couponCode);
                clearCartCoupon(cart);
                return;
            }

            // Store new original price before reapplying
            cart.setOriginalSellingPrice((int) cart.getTotalSellingPrice());
            cart.setOriginalMrpPrice(cart.getTotalMrpPrice());

            // Recalculate discount
            double discountAmount = (cart.getTotalMrpPrice() * coupon.getDiscountInPercentage()) / 100;
            double finalPrice = cart.getTotalSellingPrice() - discountAmount;
            finalPrice = Math.max(0, finalPrice);

            cart.setTotalSellingPrice(finalPrice);
            cart.setDiscount(coupon.getDiscountInPercentage());
            cart.setCouponCode(couponCode);
            cart.setCouponDiscountAmount((int) discountAmount);

            cartRepository.save(cart);
            log.info("Coupon {} reapplied successfully after cart modification", couponCode);

        } catch (Exception e) {
            log.error("Error reapplying coupon {}: {}", couponCode, e.getMessage());
            // Clear coupon if reapplication fails
            clearCartCoupon(cart);
        }
    }

    /**
     * Check if coupon is still valid after cart changes
     */
    private boolean isCouponStillValid(User user, Cart cart, Coupon coupon) {
        try {
            // Basic validation
            if (cart.getCartItems().isEmpty()) {
                return false;
            }

            // Check minimum order value
            if (cart.getTotalMrpPrice() < coupon.getMinimumOrderValue()) {
                log.warn("Cart value {} is below coupon minimum {} after modification",
                        cart.getTotalMrpPrice(), coupon.getMinimumOrderValue());
                return false;
            }

            // Check if user still has this coupon available
            if (user.getUsedCoupons().contains(coupon)) {
                return true; // User already used it, but it's still applied
            }

            // Check coupon active status and dates
            LocalDateTime now = LocalDateTime.now();
            return coupon.isActive() &&
                    !now.isBefore(coupon.getStartDate()) &&
                    !now.isAfter(coupon.getEndDate());

        } catch (Exception e) {
            log.error("Error validating coupon after cart modification: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Clear coupon from cart
     */
    private void clearCartCoupon(Cart cart) {
        cart.setCouponCode(null);
        cart.setCouponDiscountAmount(null);
        cart.setOriginalSellingPrice(null);
        cart.setOriginalMrpPrice(null);

        // Recalculate discount without coupon
        if (!cart.getCartItems().isEmpty()) {
            cart.setDiscount(calculateDiscountPercentage(cart.getTotalMrpPrice(), (int) cart.getTotalSellingPrice()));
        } else {
            cart.setDiscount(0);
        }

        cartRepository.save(cart);
        log.info("Coupon cleared from cart");
    }

    /**
     * Update cart totals (your existing method)
     */
    private void updateCartTotals(Cart cart) {
        int totalMrpPrice = 0;
        int totalSellingPrice = 0;
        int totalItems = 0;

        for (CartItem cartItem : cart.getCartItems()) {
            totalMrpPrice += cartItem.getMrpPrice();
            totalSellingPrice += cartItem.getSellingPrice();
            totalItems += cartItem.getQuantity();
        }

        cart.setTotalItems(totalItems);
        cart.setTotalMrpPrice(totalMrpPrice);
        cart.setTotalSellingPrice(totalSellingPrice);

        // Only update discount if no coupon is applied
        if (cart.getCouponCode() == null) {
            cart.setDiscount(calculateDiscountPercentage(totalMrpPrice, totalSellingPrice));
        }
    }



}
