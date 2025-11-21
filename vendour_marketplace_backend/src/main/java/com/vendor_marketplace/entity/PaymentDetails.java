package com.vendor_marketplace.entity;

import com.vendor_marketplace.entity.enums.PaymentMethod;
import com.vendor_marketplace.entity.enums.PaymentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetails {

    @Column(length = 500)
    private String stripePaymentLinkId;

    @Column(length = 500)
    private String jazzCashTransactionReferenceNumber;

    @Column(length = 500)
    private String jazzCashTransactionSecureHash;
    private Long amount;


    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
}
