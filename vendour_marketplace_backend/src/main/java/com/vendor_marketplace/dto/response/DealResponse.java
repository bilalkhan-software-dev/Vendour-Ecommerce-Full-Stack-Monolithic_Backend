package com.vendor_marketplace.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DealResponse {

    private Long id;
    private Integer discount;
    private HomeCategoryResponse homeCategory;


}
