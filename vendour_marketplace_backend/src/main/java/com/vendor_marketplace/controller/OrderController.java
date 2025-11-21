package com.vendor_marketplace.controller;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.dto.request.ShippingAddressRequest;
import com.vendor_marketplace.dto.response.OrderItemResponse;
import com.vendor_marketplace.dto.response.OrderResponse;
import com.vendor_marketplace.dto.response.StripePaymentInitiationResponse;
import com.vendor_marketplace.endpoint.OrderControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.OrderService;
import com.vendor_marketplace.entity.enums.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
@Validated
public class OrderController implements OrderControllerEndpoint {

    private final OrderService orderService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> placeOrderUsingStripeRedirectUrlMethod(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod) throws StripeException {

        StripePaymentInitiationResponse stripePaymentInitiationResponse = orderService.placeOrderForStripeRedirectBasedUrl(jwt, addressRequest, paymentMethod);
        if (!ObjectUtils.isEmpty(stripePaymentInitiationResponse)) {
            return response.createBuildResponse("Your order placed successfully!. Enter your payment details and amount to confirm it.", stripePaymentInitiationResponse, HttpStatus.OK);
        }

        return response.createBuildResponseMessage("Failed to place order. Please try again later!", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<?> placeOrderUsingJazzcashApiMethod(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod, String jazzCashAccountMobileNo) {

        Boolean b = orderService.placeOrderUsingJazzcashApi(jwt, addressRequest, paymentMethod, jazzCashAccountMobileNo);

        if (b) {
            return response.createBuildResponse(
                    "Thank you for your trust! Your order has been placed successfully and will be delivered within 7 days.",
                    true,
                    HttpStatus.OK
            );
        }


        return response.createErrorResponseMessage(
                "Order placement failed.\n" +
                        "A possible reason is that you did not provide the OTP to JazzCash. " +
                        "When placing an order, you receive an OTP and confirmation request from JazzCash. " +
                        "Your order is only confirmed after successful authentication. " +
                        "Please try again using this process.",
                HttpStatus.BAD_REQUEST
        );

    }

    @Override
    public ResponseEntity<?> userOrders(String jwt) {

        List<OrderResponse> userOrders = orderService.userOrders(jwt);
        if (!CollectionUtils.isEmpty(userOrders)) {
            return response.createBuildResponse("Your orders retrieved successfully!", userOrders, HttpStatus.OK);
        }

        return response.createErrorResponse("You currently don't hava any orders!", userOrders, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> orderDetailsById(Long orderId) {

        OrderResponse order = orderService.findOrderById(orderId);

        return response.createBuildResponse("Order details retrieved successfully!", order, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getOrderItemById(Long orderItemId) {

        OrderItemResponse orderItem = orderService.getOrderItemById(orderItemId);

        return response.createBuildResponse("Order item retrieved successfully!", orderItem, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> cancelOrder(String jwt, Long orderId) {

        OrderResponse orderResponse = orderService.cancelOrder(jwt, orderId);
        return response.createBuildResponse("Order canceled successfully!", orderResponse, HttpStatus.OK);
    }


}
