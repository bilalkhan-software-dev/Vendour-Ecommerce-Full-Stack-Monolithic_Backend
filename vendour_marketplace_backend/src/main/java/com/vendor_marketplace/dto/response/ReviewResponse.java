package com.vendor_marketplace.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;

    private String description;
    private double rating;
    private LocalDateTime reviewDate;

    @Builder.Default
    private List<String> productImages = new ArrayList<>();

    private ProductResponse product;
    private UserResponse user;


}
