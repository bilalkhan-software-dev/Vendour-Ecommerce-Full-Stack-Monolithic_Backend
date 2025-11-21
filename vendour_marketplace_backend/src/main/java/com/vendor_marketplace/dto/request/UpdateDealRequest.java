package com.vendor_marketplace.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateDealRequest {

    @Positive(message = "Discount must be greater than zero")
    private Integer discount;


    @Valid
    private HomeCategoryRequest homeCategory;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class HomeCategoryRequest {
        private Long id;
    }
}
