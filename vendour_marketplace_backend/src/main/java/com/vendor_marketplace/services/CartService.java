package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.AddItemToCartRequest;
import com.vendor_marketplace.dto.response.CartItemResponse;
import com.vendor_marketplace.dto.response.CartResponse;

public interface CartService {

    CartItemResponse addCartItem(String jwt, AddItemToCartRequest request);

    CartResponse findUserCart(String jwt);

    void deleteCartAfterSuccessfulOrderAndPaymentVerified(Long cartId);


}
