package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.CouponResponse;
import com.vendor_marketplace.entity.Coupon;

import java.util.stream.Collectors;

public class CouponMapper {

    public static CouponResponse toCouponResponse(Coupon coupon) {

        if (coupon == null) {
            return null;
        }

        return CouponResponse.builder()
                .couponId(coupon.getId())
                .code(coupon.getCode())
                .discountInPercentage(coupon.getDiscountInPercentage())
                .endDate(coupon.getEndDate())
                .startDate(coupon.getStartDate())
                .isActive(coupon.isActive())
                .minimumOrderValue(coupon.getMinimumOrderValue())
                .usedByUsers(coupon.getUsedByUsers().stream().map(UserMapper::toUserResponse).collect(Collectors.toSet()))
                .build();
    }
}
