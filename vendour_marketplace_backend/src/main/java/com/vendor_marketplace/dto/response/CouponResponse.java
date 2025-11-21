package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {

    private Long couponId;

    private String code;

    private double discountInPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private double minimumOrderValue;

    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private Set<UserResponse> usedByUsers = new HashSet<>();


}
