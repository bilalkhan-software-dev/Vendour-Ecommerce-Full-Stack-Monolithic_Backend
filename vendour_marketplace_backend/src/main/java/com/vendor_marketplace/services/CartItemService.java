package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.UpdateCartItemRequest;
import com.vendor_marketplace.dto.response.CartItemResponse;

public interface CartItemService {

    CartItemResponse updateCartItem(String jwt, Long cartItemId, UpdateCartItemRequest cartItemRequest);

    void removeCartItem(String jwt, Long cartItemId);

    CartItemResponse findCartItemById(Long cartItemId);


}
