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

    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;

    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;

    private UserResponse user;
    private List<OrderItemResponse> orderItems;
    private AddressResponse address;
    private PaymentDetailsResponse paymentDetails;
//    private PaymentOrderResponse paymentOrder;


    // ------------------ Nested DTO classes ------------------ //

//    @Data
//    @AllArgsConstructor
//    @NoArgsConstructor
//    @Builder
//    public static class OrderItemResponse {
//
//        private Long id;
//
//        private Long productId;
//        private String productTitle;
//        private String productDescription;
//        private List<String> productImages;
//
//        private Integer quantity;
//        private Integer mrpPrice;
//        private Integer sellingPrice;
//        private String size;
//        private Long userId;
//    }

//    @Data
//    @AllArgsConstructor
//    @NoArgsConstructor
//    @Builder
//    public static class PaymentOrderResponse {
//        public Long id;
//        private Long amountPaid;
//        private PaymentOrderStatus paymentOrderStatus;
//        private PaymentMethod paymentMethod;
//        private String paymentLinkId;
//        private UserResponse user;
//    }

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
