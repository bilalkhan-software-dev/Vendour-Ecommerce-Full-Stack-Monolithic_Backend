package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {

    private Long id;

    private Integer quantity;
    private Integer mrpPrice;
    private Integer sellingPrice;
    private String size;

    private Long userId;

    private ProductResponse product;
}
