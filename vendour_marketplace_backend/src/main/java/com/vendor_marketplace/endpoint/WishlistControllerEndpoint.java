package com.vendor_marketplace.endpoint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping("/api/v1/wishlist")
public interface WishlistControllerEndpoint {

    @PostMapping("/create")
    ResponseEntity<?> createWishlist(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt
    );

    @GetMapping("/user")
    ResponseEntity<?> getWishlistOfTheUser(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt
    );

    @PutMapping("/add/product/{productId}")
    ResponseEntity<?> addProductWishlist(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @PathVariable Long productId
    );
}
