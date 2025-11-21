package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.entity.Cart;

import java.util.stream.Collectors;

public class CartMapper {

    public static CartResponse toCartResponse(Cart cart) {
        if (cart == null) return null;

        return CartResponse.builder()
                .id(cart.getId())
                .user(UserMapper.toUserResponse(cart.getUser()))
                .cartItems(cart.getCartItems().stream()
                        .map(CartItemMapper::toCartItemResponse)
                        .collect(Collectors.toSet()))
                .totalSellingPrice(cart.getTotalSellingPrice())
                .totalItems(cart.getTotalItems())
                .totalMrpPrice(cart.getTotalMrpPrice())
                .discount(cart.getDiscount())
                .couponCode(cart.getCouponCode())
                .build();
    }
}
