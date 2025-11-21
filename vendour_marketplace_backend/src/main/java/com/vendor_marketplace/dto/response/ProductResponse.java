package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String title;
    private String description;

    private int mrpPrice;
    private int sellingPrice;
    private int stocks;
    private double discountInPercentage;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<String> images = new ArrayList<>();

    private String color;
    private String sizes;
    private String brand;

    private int ratings;

    private ProductSeller seller;
    private ProductCategory category;

    @Builder.Default
    private List<ProductReview> productReviews = new ArrayList<>();


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductCategory {
        private Long id;
        private String name;
        private Integer level;
        private String categoryId;
        private ProductCategory parentCategory;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductSeller {

        private Long id;
        private String name;
        private String email;
        private String businessName;


    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductReview {

        private Long productId;
        private String description;
        private ReviewUser reviewUser;
        private double rating;

        @Builder.Default
        private List<String> productImages = new ArrayList<>();

        private LocalDateTime reviewCreatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewUser {
        private Long userId;
        private String fullName;
        private String email;
    }

}
