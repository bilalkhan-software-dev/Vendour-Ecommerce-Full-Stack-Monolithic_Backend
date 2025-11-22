package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {

    private Long id;

    private UserResponse user;


    @Builder.Default
    private Set<CartItemResponse> cartItems = new HashSet<>();

    private double totalSellingPrice;
    private int totalItems;
    private int totalMrpPrice;
    private double discount;
    private String couponCode;

    private Integer couponDiscountAmount;
    private Integer originalMrpPrice;
    private Integer originalSellingPrice;

}
