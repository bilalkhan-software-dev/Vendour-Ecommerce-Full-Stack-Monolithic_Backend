package com.vendor_marketplace.endpoint;


import com.vendor_marketplace.dto.request.AddItemToCartRequest;
import com.vendor_marketplace.dto.request.UpdateCartItemRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping(
        "/api/v1/cart")
public interface CartControllerEndpoint {

    @PostMapping("/add/item")
    ResponseEntity<?> addProductToCart(@RequestHeader(AUTHORIZATION_HEADER) String jwt, @Valid @RequestBody AddItemToCartRequest request);

    @PatchMapping("/update/item/{cartItemId}")
    ResponseEntity<?> updateCartItem(@RequestHeader(AUTHORIZATION_HEADER) String jwt, @PathVariable Long cartItemId, @Valid @RequestBody UpdateCartItemRequest request);

    @DeleteMapping("/delete/item/{cartItemId}")
    ResponseEntity<?> removeCartItem(@RequestHeader(AUTHORIZATION_HEADER) String jwt, @PathVariable Long cartItemId);

    @GetMapping("/user/")
    ResponseEntity<?> findUserCart(@RequestHeader(AUTHORIZATION_HEADER) String jwt);

    @GetMapping("/{cartItemId}")
    ResponseEntity<?> getCartItemDetailsById(@PathVariable Long cartItemId);


}
