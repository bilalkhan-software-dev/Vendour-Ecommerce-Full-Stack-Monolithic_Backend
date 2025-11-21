package com.vendor_marketplace.dto.request;

import com.vendor_marketplace.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentRequest {

    private Long amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private String mobileNumber; // only for JazzCash Mobile


}
