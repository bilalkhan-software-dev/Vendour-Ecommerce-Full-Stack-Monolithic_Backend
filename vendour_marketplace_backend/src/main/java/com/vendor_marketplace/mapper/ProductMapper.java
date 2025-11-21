package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.entity.Category;
import com.vendor_marketplace.entity.Product;

import java.util.Collections;
import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductResponse toProductResponse(Product product) {
        if (product == null) return null;

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .mrpPrice(product.getMrpPrice())
                .sellingPrice(product.getSellingPrice())
                .stocks(product.getStocks())
                .discountInPercentage(product.getDiscountInPercentage())
                .createdAt(product.getCreatedAt())
                .images(product.getImages())
                .color(product.getColor())
                .sizes(product.getSizes())
                .ratings(product.getNumRatings())
                .brand(product.getBrand())
                .seller(product.getSeller() != null ? ProductResponse.ProductSeller.builder()
                        .id(product.getSeller().getId())
                        .name(product.getSeller().getName())
                        .email(product.getSeller().getEmail())
                        .businessName(product.getSeller().getBusinessDetails() != null
                                ? product.getSeller().getBusinessDetails().getBusinessName()
                                : null)
                        .build() : null)
                .category(mapToCategory(product.getCategory()))
                .productReviews(product.getReviews() != null ? product.getReviews().stream().map(review ->
                        ProductResponse.ProductReview.builder()
                                .productId(product.getId())
                                .description(review.getDescription())
                                .rating(review.getRating())
                                .reviewCreatedAt(review.getReviewDate())
                                .productImages(review.getProductImages())
                                .reviewUser(review.getUser() != null ? ProductResponse.ReviewUser.builder()
                                        .userId(review.getUser().getId())
                                        .fullName(review.getUser().getFullName())
                                        .email(review.getUser().getEmail())
                                        .build() : null)
                                .build()
                ).collect(Collectors.toList()) : Collections.emptyList()) // return an empty list
                .build();
    }


    public static ProductResponse.ProductCategory mapToCategory(Category category) {
        if (category == null) {
            return null; // stop condition if category null
        }
        return ProductResponse.ProductCategory.builder()
                .id(category.getId())
                .name(category.getName())
                .level(category.getLevel())
                .categoryId(category.getCategoryId())
                .parentCategory(mapToCategory(category.getParentCategory())) // recursive call
                .build();
    }
}
