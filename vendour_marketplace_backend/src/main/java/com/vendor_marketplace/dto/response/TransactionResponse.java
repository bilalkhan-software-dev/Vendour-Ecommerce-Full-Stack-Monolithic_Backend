package com.vendor_marketplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private Long id;
    private SellerResponse seller;
    private UserResponse customer;
    private OrderResponse order;
    private LocalDateTime createdAt;



}
