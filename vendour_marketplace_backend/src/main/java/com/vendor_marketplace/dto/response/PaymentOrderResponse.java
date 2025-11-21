package com.vendor_marketplace.dto.response;

import com.vendor_marketplace.entity.enums.PaymentMethod;
import com.vendor_marketplace.entity.enums.PaymentOrderStatus;
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
public class PaymentOrderResponse {

    public Long id;

    private Long amountPaid;

    private PaymentOrderStatus paymentOrderStatus;

    private PaymentMethod paymentMethod;

    // The hosted payment link / txnRef we get when we create the link
    private String paymentLinkId;
    private UserResponse user;

    @Builder.Default
    private Set<OrderResponse> orders = new HashSet<>();


//    @Data
//    @Builder
//    @AllArgsConstructor
//    @NoArgsConstructor
//    public static class OrderResponse {
//        private Long id;
//        private String orderId;
//        private Long sellerId;
//
//        private double totalMrpPrice;
//        private Integer totalSellingPrice;
//        private Integer discount;
//
//        private OrderStatus orderStatus;
//        private PaymentStatus paymentStatus;
//
//        private LocalDateTime orderDate;
//        private LocalDateTime deliveryDate;
//
//    }


}
