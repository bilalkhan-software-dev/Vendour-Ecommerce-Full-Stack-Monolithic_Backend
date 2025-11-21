package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.OrderResponse;
import com.vendor_marketplace.endpoint.SellerOrderControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.OrderService;
import com.vendor_marketplace.entity.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SellerOrderController implements SellerOrderControllerEndpoint {

    private final OrderService orderService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> getSellerOrders(String jwt) {

        List<OrderResponse> sellerOrders = orderService.sellerOrders(jwt);

        if (!CollectionUtils.isEmpty(sellerOrders)) {
            return response.createBuildResponse("Seller orders retrieved successfully!", sellerOrders, HttpStatus.OK);
        }


        return response.createBuildResponse("You currently does not have any orders placed!", sellerOrders, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateOrderStatus(String jwt, Long orderId, OrderStatus orderStatus) {

        OrderResponse orderResponse = orderService.updateOrderStatus(jwt, orderId, orderStatus);

        return response.createBuildResponse("Order status updated successfully!", orderResponse, HttpStatus.OK);
    }
}
