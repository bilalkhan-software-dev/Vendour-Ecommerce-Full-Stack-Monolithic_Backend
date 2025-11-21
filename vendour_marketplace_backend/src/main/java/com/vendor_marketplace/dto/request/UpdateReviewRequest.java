package com.vendor_marketplace.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateReviewRequest {

    @Size(min = 5,max = 200,message = "Description must between 6 to 200 characters")
    private String description;

    private Double rating;

    private List<String> productImages;
}
