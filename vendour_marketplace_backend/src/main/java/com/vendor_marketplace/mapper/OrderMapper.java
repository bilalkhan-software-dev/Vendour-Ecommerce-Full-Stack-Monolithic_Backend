package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.OrderResponse;
import com.vendor_marketplace.dto.response.OrderItemResponse;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.entity.Order;
import com.vendor_marketplace.entity.OrderItem;

import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderResponse toOrderResponse(Order order) {
        if (order == null) {
            return null;
        }

        return OrderResponse.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .sellerId(order.getSellerId())
                .totalMrpPrice(order.getTotalMrpPrice())
                .totalSellingPrice(order.getTotalSellingPrice())
                .discount(order.getDiscount())
                .couponCode(order.getCouponCode())
                .couponDiscountAmount(order.getCouponDiscountAmount())
                .originalSellingPrice(order.getOriginalSellingPrice())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .orderDate(order.getOrderDate())
                .deliveryDate(order.getDeliveryDate())

                // Map User
                .user(UserResponse.builder()
                        .id(order.getUser().getId())
                        .email(order.getUser().getEmail())
                        .fullName(order.getUser().getFullName())
                        .build())

                // Map Order Items
                .orderItems(order.getOrderItems().stream()
                        .map(OrderItemMapper::toOrderItemResponse)
                        .collect(Collectors.toList()))

                // Map Address
                .address(OrderResponse.AddressResponse.builder()
                        .name(order.getShippingAddress().getName())
                        .locality(order.getShippingAddress().getLocality())
                        .city(order.getShippingAddress().getCity())
                        .state(order.getShippingAddress().getState())
                        .pinCode(order.getShippingAddress().getPinCode())
                        .mobile(order.getShippingAddress().getMobile())
                        .address(order.getShippingAddress().getAddress())
                        .build())

                // Map Payment
                .paymentDetails(
                        order.getPaymentDetails() != null ?
                                OrderResponse.PaymentDetailsResponse.builder()
                                        .paymentMethod(order.getPaymentDetails().getPaymentMethod())
                                        .amount(order.getPaymentDetails().getAmount())
                                        .jazzCashTransactionSecureHash(order.getPaymentDetails().getJazzCashTransactionSecureHash())
                                        .jazzCashTransactionReferenceNumber(order.getPaymentDetails().getJazzCashTransactionReferenceNumber())
                                        .stripePaymentLinkId(order.getPaymentDetails().getStripePaymentLinkId())
                                        .build() : null)

                // Map Payment Order
//                .paymentOrder(order.getPaymentOrder() != null ?
//                        OrderResponse.PaymentOrderResponse.builder()
//                                .id(order.getPaymentOrder().getId())
//                                .amountPaid(order.getPaymentOrder().getAmount())
//                                .paymentLinkId(order.getPaymentOrder().getPaymentLinkId())
//                                .paymentMethod(order.getPaymentOrder().getPaymentMethod())
//                                .paymentOrderStatus(order.getPaymentOrder().getPaymentOrderStatus())
//                                .user(order.getPaymentOrder().getUser() != null ?
//                                        UserResponse.builder()
//                                                .fullName(order.getPaymentOrder().getUser().getFullName())
//                                                .email(order.getPaymentOrder().getUser().getEmail())
//                                                .role(order.getPaymentOrder().getUser().getRole().name())
//                                                .id(order.getPaymentOrder().getUser().getId())
//                                                .build() : null
//                                )
//                                .build() : null)
                .build();
    }

//    private static OrderResponse.OrderItemResponse mapOrderItem(OrderItem item) {
//        return OrderResponse.OrderItemResponse.builder()
//                .id(item.getId())
//                .productId(item.getProduct().getId())
//                .productTitle(item.getProduct().getTitle())
//                .productDescription(item.getProduct().getDescription())
//                .productImages(item.getProduct().getImages())
//                .quantity(item.getQuantity())
//                .mrpPrice(item.getMrpPrice())
//                .sellingPrice(item.getSellingPrice())
//                .size(item.getSize())
//                .userId(item.getUserId())
//                .build();
//    }
}
