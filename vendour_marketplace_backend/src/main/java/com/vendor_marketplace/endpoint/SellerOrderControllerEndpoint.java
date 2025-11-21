package com.vendor_marketplace.endpoint;


import com.vendor_marketplace.entity.enums.OrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;
import static com.vendor_marketplace.utils.Constants.FOR_SELLER_ONLY;

@RequestMapping("/api/v1/seller/orders")
@PreAuthorize(FOR_SELLER_ONLY)
public interface SellerOrderControllerEndpoint {

    @GetMapping("/")
    ResponseEntity<?> getSellerOrders(@RequestHeader(AUTHORIZATION_HEADER) String jwt);

    @PatchMapping("/{orderId}/update/status/{orderStatus}")
    ResponseEntity<?> updateOrderStatus(@RequestHeader(AUTHORIZATION_HEADER) String jwt,
                                        @PathVariable Long orderId,
                                        @PathVariable OrderStatus orderStatus
    );

}
