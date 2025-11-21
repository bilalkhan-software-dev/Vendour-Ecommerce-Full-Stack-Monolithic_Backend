package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StripePaymentInitiationResponse {

    private String paymentId;   // transaction reference or Stripe session id
    private String paymentUrl;  // redirect URL
    private Long amount;
    private String currency;
    private Boolean success; // using wrapper because if empty then shows null
    private String message;

    @Builder.Default
    private Set<OrderResponse> orders = new HashSet<>(); // still return orders if you want

}
