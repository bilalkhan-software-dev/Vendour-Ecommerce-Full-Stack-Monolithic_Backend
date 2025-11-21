package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.ReviewRequest;
import com.vendor_marketplace.dto.request.UpdateReviewRequest;
import com.vendor_marketplace.dto.response.ReviewResponse;
import com.vendor_marketplace.endpoint.ReviewControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class ReviewController implements ReviewControllerEndpoint {

    private final ReviewService reviewService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> addReview(String jwt, Long productId, ReviewRequest reviewRequest) {

        ReviewResponse reviewResponse = reviewService.addReview(jwt, productId, reviewRequest);

        if (!ObjectUtils.isEmpty(reviewResponse)) {
            return response.createBuildResponse("Review added successfully!", reviewResponse, HttpStatus.CREATED);
        }

        return response.createErrorResponse("Failed to add review!", reviewResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> updateReview(String jwt, Long reviewId, UpdateReviewRequest reviewRequest) {

        ReviewResponse reviewResponse = reviewService.updateReview(jwt, reviewId, reviewRequest);
        return response.createBuildResponse("Review updated successfully!", reviewResponse, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> deleteReviewById(String jwt, Long reviewId) {

        reviewService.deleteReview(jwt, reviewId);

        return response.createBuildResponseMessage("Review deleted successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getReviewsOnTheProduct(Long productId) {

        List<ReviewResponse> reviews = reviewService.getReviewByProductById(productId);

        if (!CollectionUtils.isEmpty(reviews)) {
            return response.createBuildResponse("Reviews found successfully!", reviews, HttpStatus.OK);
        }

        return response.createBuildResponse("This product currently does not have any reviews!", reviews, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> getReviewDetailById(Long reviewId) {

        ReviewResponse reviewDetailById = reviewService.getReviewDetailById(reviewId);

        return response.createBuildResponse("Review detail found successfully!", reviewDetailById, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getMyReviews(String jwt) {


        List<ReviewResponse> myReviews = reviewService.getMyReviews(jwt);

        if (!CollectionUtils.isEmpty(myReviews)) {
            return response.createBuildResponse("Reviews found successfully!", myReviews, HttpStatus.OK);
        }

        return response.createBuildResponse("You currently does not submit any reviews!", myReviews, HttpStatus.OK);
    }
}
