package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.ReviewRequest;
import com.vendor_marketplace.dto.request.UpdateReviewRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping("/api/v1/review")
public interface ReviewControllerEndpoint {

    @PostMapping("/create/product/{productId}")
    ResponseEntity<?> addReview(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest reviewRequest
    );

    @PutMapping("/update/{reviewId}")
    ResponseEntity<?> updateReview(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequest reviewRequest
    );

    @DeleteMapping("/delete/{reviewId}")
    ResponseEntity<?> deleteReviewById(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @PathVariable Long reviewId);

    @GetMapping("/product/{productId}")
    ResponseEntity<?> getReviewsOnTheProduct(@PathVariable Long productId);

    @GetMapping("/{reviewId}")
    ResponseEntity<?> getReviewDetailById(@PathVariable Long reviewId);

    @GetMapping("/reviews/user")
    ResponseEntity<?> getMyReviews(@RequestHeader(AUTHORIZATION_HEADER) String jwt);


}
