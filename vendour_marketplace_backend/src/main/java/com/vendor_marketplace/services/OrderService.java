package com.vendor_marketplace.services;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.dto.request.ShippingAddressRequest;
import com.vendor_marketplace.dto.response.OrderItemResponse;
import com.vendor_marketplace.dto.response.OrderResponse;
import com.vendor_marketplace.dto.response.StripePaymentInitiationResponse;
import com.vendor_marketplace.entity.enums.OrderStatus;
import com.vendor_marketplace.entity.enums.PaymentMethod;

import java.util.List;

public interface OrderService {

    StripePaymentInitiationResponse placeOrderForStripeRedirectBasedUrl(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod) throws StripeException;

    Boolean placeOrderUsingJazzcashApi(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod,String jazzCashAccountMobileNo);


//    Set<OrderResponse> placeOrder(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod);

    OrderResponse findOrderById(Long orderId);

    List<OrderResponse> userOrders(String jwt);

    List<OrderResponse> sellerOrders(String jwt);

    OrderResponse updateOrderStatus(String jwt, Long orderId, OrderStatus orderStatus);

    OrderResponse cancelOrder(String jwt, Long orderId);

    OrderItemResponse getOrderItemById(Long orderItemId);


}

