package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.entity.User;
import org.hibernate.mapping.Collection;

import java.util.Collections;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        if (user == null) return null;
        user.getAddress().stream().forEach(System.out::println);

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .address(!user.getAddress().isEmpty() ? user.getAddress().stream().map(address ->
                                        UserResponse.AddressResponse.builder()
                                                .city(address.getCity())
                                                .state(address.getState())
                                                .locality(address.getLocality())
                                                .mobile(address.getMobile())
                                                .pinCode(address.getPinCode())
                                                .address(address.getAddress())
                                                .name(address.getName())
                                                .build()
                        ).collect(Collectors.toSet()) : Collections.emptySet())
                .usedCoupons(!user.getUsedCoupons().isEmpty() ?
                        user.getUsedCoupons().stream().map(coupon ->
                                UserResponse.CouponResponse.builder()
                                        .code(coupon.getCode())
                                        .discountInPercentage(coupon.getDiscountInPercentage())
                                        .minimumOrderValue(coupon.getMinimumOrderValue())
                                        .build()
                        ).collect(Collectors.toSet()) :
                        Collections.emptySet()
                )
                .build();
    }
}
