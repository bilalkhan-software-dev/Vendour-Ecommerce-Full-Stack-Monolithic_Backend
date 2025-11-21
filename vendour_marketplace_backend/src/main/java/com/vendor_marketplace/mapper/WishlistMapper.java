package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.WishlistResponse;
import com.vendor_marketplace.entity.Wishlist;

import java.util.stream.Collectors;

public class WishlistMapper {

    public static WishlistResponse toWishlistResponse(Wishlist wishlist) {

        if (wishlist == null) {
            return null;
        }

        return WishlistResponse.builder()
                .wishlistId(wishlist.getId())
                .user(wishlist.getUser() != null ?
                        UserMapper.toUserResponse(wishlist.getUser())
                        : null)
                .products(wishlist.getProducts() != null ?
                        wishlist.getProducts().stream().map(ProductMapper::toProductResponse).collect(Collectors.toSet())
                        : null)
                .build();
    }

}
