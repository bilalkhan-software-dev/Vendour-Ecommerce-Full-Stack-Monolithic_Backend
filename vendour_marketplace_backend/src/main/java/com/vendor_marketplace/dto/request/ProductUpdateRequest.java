package com.vendor_marketplace.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductUpdateRequest {

    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    private String category1;
    private String category2;
    private String category3;

    private String color;

    @Positive(message = "Stocks must be greater than 0")
    private Integer stocks;

    private String sizes;

    @Positive(message = "Selling price must be greater than 0")
    private Integer sellingPrice;

    @Positive(message = "MRP price must be greater than 0")
    @Min(value = 1, message = "MRP must be at least 1")
    private Integer mrpPrice;

    private List<@NotBlank(message = "Image URL cannot be blank") String> images;
}
