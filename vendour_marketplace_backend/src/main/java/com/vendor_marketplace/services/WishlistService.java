package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.response.WishlistResponse;

public interface WishlistService {

    WishlistResponse createWishlist(String jwt);
    WishlistResponse getWishlistByUser(String jwt);

    // This method work for both product add or remove from wishlist
    WishlistResponse addProductToWishlist(String jwt,Long productId);

}
