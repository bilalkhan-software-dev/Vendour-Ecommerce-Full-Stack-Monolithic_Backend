package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.OrderItemResponse;
import com.vendor_marketplace.entity.OrderItem;

public class OrderItemMapper {

    public static OrderItemResponse toOrderItemResponse(OrderItem item) {

        if(item == null) {
            return null;
        }

       return OrderItemResponse.builder()
               .orderItemId(item.getId())
               .quantity(item.getQuantity())
               .mrpPrice(item.getMrpPrice())
               .sellingPrice(item.getSellingPrice())
               .originalSellingPrice(item.getOriginalSellingPrice())
               .couponDiscountAmount(item.getCouponDiscountAmount())
               .size(item.getSize())
               .userId(item.getUserId())
               .product(ProductMapper.toProductResponse(item.getProduct()))
               .build();
    }
}
