package com.vendor_marketplace.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemResponse {

    private Long orderItemId;
    private String size;
    private int quantity;
    private Integer mrpPrice;
    private Integer sellingPrice;

    private Integer couponDiscountAmount;
    private Integer originalSellingPrice;
    private Long userId;
    private ProductResponse product;
}
