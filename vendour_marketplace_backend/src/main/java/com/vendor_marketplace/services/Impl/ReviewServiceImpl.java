package com.vendor_marketplace.services.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vendor_marketplace.dto.request.ReviewRequest;
import com.vendor_marketplace.dto.request.UpdateReviewRequest;
import com.vendor_marketplace.dto.response.ReviewResponse;
import com.vendor_marketplace.entity.Product;
import com.vendor_marketplace.entity.Review;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.ReviewMapper;
import com.vendor_marketplace.repository.ProductRepository;
import com.vendor_marketplace.repository.ReviewRepository;
import com.vendor_marketplace.services.ReviewService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ProductRepository productRepository;
    private final RedisUtil redisUtil;

    @Override
    @Transactional
    public ReviewResponse addReview(String jwt, Long productId, ReviewRequest reviewRequest) {

        User user = userService.getUserFromJwt(jwt);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // check if user already reviewed
        boolean alreadyReviewed = product.getReviews()
                .stream()
                .anyMatch(r -> r.getUser().getId().equals(user.getId()));

        Review review = Review.builder()
                .description(reviewRequest.getDescription())
                .rating(reviewRequest.getRating())
                .productImages(reviewRequest.getProductImages())
                .product(product)
                .user(user)
                .build();

        // bidirectional mapping
        product.getReviews().add(review);

        // only increment if first time review
        if (!alreadyReviewed) {
            product.setNumRatings(product.getNumRatings() + 1);
        }

        // recalculate average rating
        double avgRating = product.getReviews().stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        product.setAverageRating(avgRating);

        // cascade will handle saving the review too
        productRepository.save(product);


        redisUtil.deleteFromRedis(RedisUtil.productReviews(productId));
        redisUtil.deleteFromRedis(RedisUtil.userReview(review.getUser().getId()));

        return ReviewMapper.toReviewResponse(review);
    }


    @Override
    @Transactional
    public ReviewResponse updateReview(String jwt, Long reviewId, UpdateReviewRequest reviewRequest) {
        User user = userService.getUserFromJwt(jwt);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Ensure the review belongs to the user
        if (!review.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only update reviews created by you!");
        }

        AtomicBoolean ratingChanged = new AtomicBoolean(false);

        // update description if provided and not blank
        Optional.ofNullable(reviewRequest.getDescription())
                .filter(desc -> !desc.isBlank())
                .ifPresent(review::setDescription);

        // update product images if provided and not empty
        Optional.ofNullable(reviewRequest.getProductImages())
                .filter(images -> !images.isEmpty())
                .ifPresent(review::setProductImages);

        // update rating if provided, valid, and different
        Optional.ofNullable(reviewRequest.getRating())
                .filter(rating -> rating > 0)
                .ifPresent(rating -> {
                    if (!rating.equals(review.getRating())) {
                        review.setRating(rating);
                        ratingChanged.set(true);
                    }
                });

        // update last modified date
        review.setUpdateReviewDate(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);

        // recalculate product average rating if rating changed
        if (ratingChanged.get()) {
            Product product = review.getProduct();

            double avgRating = product.getReviews().stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);

            product.setAverageRating(avgRating);
            productRepository.save(product);
        }

        redisUtil.deleteFromRedis(RedisUtil.productReviews(review.getProduct().getId()));
        redisUtil.deleteFromRedis(RedisUtil.userReview(review.getUser().getId()));


        return ReviewMapper.toReviewResponse(updatedReview);
    }


    @Override
    @Transactional
    public void deleteReview(String jwt, Long reviewId) {

        User user = userService.getUserFromJwt(jwt);
        Review review = reviewRepository.findById(reviewId).orElseThrow(
                () -> new ResourceNotFoundException("Review not found with id: " + reviewId)
        );
        if (!review.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You have only access to delete the review review which is created by you!");
        }
        String cacheKey = RedisUtil.productReviews(review.getProduct().getId());


        redisUtil.deleteFromRedis(cacheKey);
        redisUtil.deleteFromRedis(RedisUtil.userReview(review.getUser().getId()));

        reviewRepository.delete(review);

    }

    @Override
    public List<ReviewResponse> getReviewByProductById(Long productId) {


        String cacheKey = RedisUtil.productReviews(productId);

        List<ReviewResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<ReviewResponse>>() {
        });

        if (cachedResponse != null && !cachedResponse.isEmpty()) {
            return cachedResponse;
        }

        List<Review> productReviews = reviewRepository.findByProduct_id(productId);


        List<ReviewResponse> response = productReviews.stream().map(ReviewMapper::toReviewResponse).collect(Collectors.toList());

        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);

        return response;
    }

    @Override
    public ReviewResponse getReviewDetailById(Long reviewId) {
        return ReviewMapper.toReviewResponse(reviewRepository.findById(reviewId).orElseThrow(
                () -> new ResourceNotFoundException("Review not found with id: " + reviewId)
        ));
    }

    @Override
    public List<ReviewResponse> getMyReviews(String jwt) {

        User user = userService.getUserFromJwt(jwt);
        String cacheKey = RedisUtil.userReview(user.getId());

        List<ReviewResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<ReviewResponse>>() {
        });

        if (cachedResponse != null && !cachedResponse.isEmpty()) {
            return cachedResponse;
        }

        List<Review> reviews = reviewRepository.findByUser_Id(user.getId());

        List<ReviewResponse> response = reviews.stream().map(ReviewMapper::toReviewResponse).collect(Collectors.toList());
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);

        return response;
    }
}
