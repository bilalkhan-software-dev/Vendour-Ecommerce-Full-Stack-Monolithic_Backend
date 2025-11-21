package com.vendor_marketplace.endpoint;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.dto.request.ShippingAddressRequest;
import com.vendor_marketplace.entity.enums.PaymentMethod;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping("/api/v1/orders")
public interface OrderControllerEndpoint {


    @PostMapping("/place/stripe")
    ResponseEntity<?> placeOrderUsingStripeRedirectUrlMethod(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @Valid @RequestBody ShippingAddressRequest addressRequest,
            @RequestParam PaymentMethod paymentMethod
    ) throws StripeException;

    @PostMapping("/place/jazzcash")
    ResponseEntity<?> placeOrderUsingJazzcashApiMethod(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @Valid @RequestBody ShippingAddressRequest addressRequest,
            @RequestParam PaymentMethod paymentMethod,
            @RequestParam String jazzCashAccountMobileNo
    );


    @GetMapping("/users/")
    ResponseEntity<?> userOrders(@RequestHeader(AUTHORIZATION_HEADER) String jwt);

    @GetMapping("/{orderId}")
    ResponseEntity<?> orderDetailsById(@PathVariable Long orderId);

    @GetMapping("/item/{orderItemId}")
    ResponseEntity<?> getOrderItemById(@PathVariable Long orderItemId);

    @PutMapping("/cancel/{orderId}")
    ResponseEntity<?> cancelOrder(@RequestHeader(AUTHORIZATION_HEADER) String jwt, @PathVariable Long orderId);


}
