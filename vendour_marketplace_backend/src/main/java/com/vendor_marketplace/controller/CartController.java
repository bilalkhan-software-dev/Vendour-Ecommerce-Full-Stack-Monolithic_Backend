package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.AddItemToCartRequest;
import com.vendor_marketplace.dto.request.UpdateCartItemRequest;
import com.vendor_marketplace.dto.response.CartItemResponse;
import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.endpoint.CartControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.CartItemService;
import com.vendor_marketplace.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
@Validated
public class CartController implements CartControllerEndpoint {

    private final CartItemService cartItemService;
    private final CartService cartService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> addProductToCart(String jwt, AddItemToCartRequest request) {

        CartItemResponse cartItemResponse = cartService.addCartItem(jwt, request);

        if (!Objects.isNull(cartItemResponse)) {
           return response.createBuildResponse("Product added to cart successfully!", cartItemResponse, HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Product added to cart failed!", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<?> updateCartItem(String jwt, Long cartItemId, UpdateCartItemRequest request) {

        CartItemResponse isUpdated = null;

        if (request.getQuantity() > 0) {
            isUpdated = cartItemService.updateCartItem(jwt, cartItemId, request);
        }


        return response.createBuildResponse("Cart updated successfully!", isUpdated, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> removeCartItem(String jwt, Long cartItemId) {

        cartItemService.removeCartItem(jwt, cartItemId);

        return response.createBuildResponseMessage("Cart item removed successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> findUserCart(String jwt) {
        CartResponse userCart = cartService.findUserCart(jwt);

        if (!Objects.isNull(userCart)) {
          return response.createBuildResponse("Cart found successfully!", userCart, HttpStatus.OK);
        }

        return response.createErrorResponse("Current user does not have any product added to cart!", null, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getCartItemDetailsById(Long cartItemId) {

        CartItemResponse cartItemById = cartItemService.findCartItemById(cartItemId);
        return response.createBuildResponse("Cart details retrieved successfully!", cartItemById, HttpStatus.OK);
    }

}
