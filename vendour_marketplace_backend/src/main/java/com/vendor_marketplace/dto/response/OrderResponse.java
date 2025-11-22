package com.vendor_marketplace.dto.response;

import com.vendor_marketplace.entity.enums.OrderStatus;
import com.vendor_marketplace.entity.enums.PaymentStatus;
import com.vendor_marketplace.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderId;
    private Long sellerId;

    private double totalMrpPrice;
    private Integer totalSellingPrice;
    private Integer discount;

    private String couponCode;
    private Integer couponDiscountAmount;
    private Integer originalSellingPrice;

    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;

    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;

    private UserResponse user;
    private List<OrderItemResponse> orderItems;
    private AddressResponse address;
    private PaymentDetailsResponse paymentDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AddressResponse {
        private String name;
        private String locality;
        private String city;
        private String state;
        private String pinCode;
        private String mobile;
        private String address;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PaymentDetailsResponse {

        private PaymentMethod paymentMethod;
        private String stripePaymentLinkId;
        private String jazzCashTransactionReferenceNumber;
        private String jazzCashTransactionSecureHash;
        private Long amount;
        private PaymentStatus paymentStatus;

    }
}
