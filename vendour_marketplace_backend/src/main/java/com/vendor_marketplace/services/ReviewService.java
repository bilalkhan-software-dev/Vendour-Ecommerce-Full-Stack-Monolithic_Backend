package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.ReviewRequest;
import com.vendor_marketplace.dto.request.UpdateReviewRequest;
import com.vendor_marketplace.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(String jwt,Long productId,ReviewRequest reviewRequest);

    ReviewResponse updateReview(String jwt, Long reviewId, UpdateReviewRequest reviewRequest);

    void deleteReview(String jwt,Long reviewId);

    ReviewResponse getReviewDetailById(Long reviewId);

    List<ReviewResponse> getReviewByProductById(Long productId);
    List<ReviewResponse> getMyReviews(String jwt);


}
