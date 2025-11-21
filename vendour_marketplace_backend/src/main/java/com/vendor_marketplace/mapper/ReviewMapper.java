package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.ReviewResponse;
import com.vendor_marketplace.entity.Review;

public class ReviewMapper {

    public static ReviewResponse toReviewResponse(Review review) {

        if (review == null) {
            return null;
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .description(review.getDescription())
                .rating(review.getRating())
                .reviewDate(review.getReviewDate())
                .productImages(review.getProductImages())
                .product(ProductMapper.toProductResponse(review.getProduct()))
                .user(UserMapper.toUserResponse(review.getUser()))
                .build();
    }

}
