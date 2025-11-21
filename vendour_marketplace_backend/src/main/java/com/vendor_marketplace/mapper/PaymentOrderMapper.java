package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.PaymentOrderResponse;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.entity.PaymentOrder;

import java.util.stream.Collectors;

public class PaymentOrderMapper {

    public static PaymentOrderResponse toPaymentOrderResponse(PaymentOrder order) {

        if (order == null) {
            return null;
        }

        return PaymentOrderResponse.builder()
                .id(order.getId())
                .amountPaid(order.getAmount())
                .paymentLinkId(order.getPaymentLinkId())
                .paymentMethod(order.getPaymentMethod())
                .paymentOrderStatus(order.getPaymentOrderStatus())
                .user(order.getUser() != null ?
                        UserResponse.builder()
                                .fullName(order.getUser().getFullName())
                                .email(order.getUser().getEmail())
                                .role(order.getUser().getRole().name())
                                .id(order.getUser().getId())
                                .build() : null
                ).orders(
                        order.getOrders().stream().map(OrderMapper::toOrderResponse).collect(Collectors.toSet())
                ).build();
    }
}
