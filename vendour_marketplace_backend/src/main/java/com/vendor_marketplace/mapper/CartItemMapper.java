package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.CartItemResponse;
import com.vendor_marketplace.entity.CartItem;

public class CartItemMapper {

    public static CartItemResponse toCartItemResponse(CartItem cartItem) {
        if (cartItem == null) return null;

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .quantity(cartItem.getQuantity())
                .mrpPrice(cartItem.getMrpPrice())
                .sellingPrice(cartItem.getSellingPrice())
                .size(cartItem.getSize())
                .userId(cartItem.getUserId())
                .product(ProductMapper.toProductResponse(cartItem.getProduct()))
                .build();
    }
}
