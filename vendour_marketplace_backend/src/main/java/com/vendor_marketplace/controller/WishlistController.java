package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.WishlistResponse;
import com.vendor_marketplace.endpoint.WishlistControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Validated
public class WishlistController implements WishlistControllerEndpoint {

    private final WishlistService wishlistService;
    private final GenericResponseHandler response;


    @Override
    public ResponseEntity<?> createWishlist(String jwt) {
        WishlistResponse wishlist = wishlistService.createWishlist(jwt);
        if (!ObjectUtils.isEmpty(wishlist)) {
            return response.createBuildResponse("Wishlist created successfully!", wishlist, HttpStatus.CREATED);
        }
        ;

        return response.createErrorResponseMessage("Failed to create wishlist!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> getWishlistOfTheUser(String jwt) {

        WishlistResponse wishlistByUser = wishlistService.getWishlistByUser(jwt);

        if (!ObjectUtils.isEmpty(wishlistByUser)) {
            return response.createBuildResponse("User wishlist retrieved  successfully!", wishlistByUser, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("No wishlist found!", HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<?> addProductWishlist(String jwt, Long productId) {

        WishlistResponse wishlistResponse = wishlistService.addProductToWishlist(jwt, productId);

        if (!ObjectUtils.isEmpty(wishlistResponse)) {
            return response.createBuildResponse("Product added to wishlist successfully!", wishlistResponse, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("Failed to add product to wishlist!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
