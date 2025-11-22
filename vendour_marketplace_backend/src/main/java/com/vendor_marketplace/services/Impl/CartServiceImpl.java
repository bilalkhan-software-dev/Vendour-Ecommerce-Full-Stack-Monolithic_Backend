package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.request.AddItemToCartRequest;
import com.vendor_marketplace.dto.response.CartItemResponse;
import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.CartItemMapper;
import com.vendor_marketplace.mapper.CartMapper;
import com.vendor_marketplace.repository.CartItemRepository;
import com.vendor_marketplace.repository.CartRepository;
import com.vendor_marketplace.repository.CouponRepository;
import com.vendor_marketplace.repository.ProductRepository;
import com.vendor_marketplace.services.CartService;
import com.vendor_marketplace.services.CouponService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

import static com.vendor_marketplace.utils.CommonUtil.calculateDiscountPercentage;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;
    private final RedisUtil redisUtil;

    @Override
    @Transactional
    public CartItemResponse addCartItem(String jwt, AddItemToCartRequest request) {
        User user = userService.getUserFromJwt(jwt);
        
        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with id " + request.getProductId())
        );

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(
                () -> new ResourceNotFoundException("Cart not found with user id " + user.getId())
        );

        // Store coupon info before modifying cart
        String existingCouponCode = cart.getCouponCode();
        Integer originalSellingPrice = cart.getOriginalSellingPrice();
        boolean hadCoupon = existingCouponCode != null;

        CartItem cartItem = cartItemRepository.findByCartAndProductAndSize(cart, product, request.getSize());

        if (cartItem == null) {
            // Create new cart item
            CartItem item = createNewCartItem(cart, product, request);
            cart.getCartItems().add(item);
            cartItemRepository.save(item);
        } else {
            // Update existing cart item
            updateExistingCartItem(cartItem, request, product);
            cartItemRepository.save(cartItem);
        }

        // Update cart totals
        updateCartTotals(cart);
        cartRepository.save(cart);

        // Reapply coupon if it existed
        if (hadCoupon) {
            log.info("Reapplying coupon after cart modification: {}", existingCouponCode);
            reapplyCoupon(jwt, cart, existingCouponCode, originalSellingPrice);
        }

        redisUtil.deleteFromRedis(RedisUtil.userCart(user.getId()));

        CartItem responseItem = cartItem == null ?
                cartItemRepository.findByCartAndProductAndSize(cart, product, request.getSize()) : cartItem;
        return CartItemMapper.toCartItemResponse(responseItem);
    }


    private void reapplyCoupon(String jwt, Cart cart, String couponCode, Integer originalSellingPrice) {
        try {
            Coupon coupon = couponRepository.findByCode(couponCode).orElse(null);
            if (coupon == null) {
                log.warn("Coupon {} not found for reapplication", couponCode);
                return;
            }

            User user = userService.getUserFromJwt(jwt);

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
            log.info("Coupon {} reapplied successfully", couponCode);

        } catch (Exception e) {
            log.error("Error reapplying coupon {}: {}", couponCode, e.getMessage());
            // Clear coupon if reapplication fails
            cart.setCouponCode(null);
            cart.setCouponDiscountAmount(null);
            cart.setOriginalSellingPrice(null);
            cart.setOriginalMrpPrice(null);
            cartRepository.save(cart);
        }
    }

    private CartItem createNewCartItem(Cart cart, Product product, AddItemToCartRequest request) {
        CartItem item = CartItem.builder()
                .product(product)
                .quantity(request.getQuantity())
                .userId(cart.getUser().getId())
                .size(request.getSize())
                .build();

        int totalSellingPrice = request.getQuantity() * product.getSellingPrice();
        int totalMrpPrice = request.getQuantity() * product.getMrpPrice();

        item.setSellingPrice(totalSellingPrice);
        item.setMrpPrice(totalMrpPrice);
        item.setCart(cart);

        return item;
    }

    private void updateExistingCartItem(CartItem cartItem, AddItemToCartRequest request, Product product) {
        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        int newSellingPrice = newQuantity * product.getSellingPrice();
        int newMrpPrice = newQuantity * product.getMrpPrice();

        cartItem.setQuantity(newQuantity);
        cartItem.setSellingPrice(newSellingPrice);
        cartItem.setMrpPrice(newMrpPrice);
    }



    @Override
    public CartResponse findUserCart(String jwt) {
        User user = userService.getUserFromJwt(jwt);
        String cacheKey = RedisUtil.userCart(user.getId());

        CartResponse cachedResponse = redisUtil.get(cacheKey, CartResponse.class);
        if (cachedResponse != null) {
            return cachedResponse;
        }

        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(
                () -> new ResourceNotFoundException("User is not found in cart")
        );

        log.debug("=== CART FROM DATABASE ===");
        log.debug("Total MRP: {}, Total Selling: {}, Total Items: {}, Discount: {}, Coupon: {}",
                cart.getTotalMrpPrice(), cart.getTotalSellingPrice(), cart.getTotalItems(),
                cart.getDiscount(), cart.getCouponCode());

        CartResponse cartResponse = CartMapper.toCartResponse(cart);
        redisUtil.saveToRedis(cacheKey, cartResponse, RedisUtil.ONE_DAY_CACHE_TTL);

        return cartResponse;
    }


    @Override
    public void deleteCartAfterSuccessfulOrderAndPaymentVerified(Long cartId) {

        Cart cart = cartRepository.findById(cartId).orElseThrow(
                () -> new ResourceNotFoundException("Cart not found with id " + cartId)
        );

        // clear cart item
        Set<CartItem> cartItems = cart.getCartItems();

        // removing from cache
        redisUtil.deleteFromRedis(RedisUtil.userCart(cart.getUser().getId()));

        cartItemRepository.deleteAll(cartItems);
    }
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
        cart.setDiscount(calculateDiscountPercentage(totalMrpPrice, totalSellingPrice));

    }

}
