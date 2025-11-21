package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;


    @Builder.Default
    private Set<AddressResponse> address = new HashSet<>();

    private Set<CouponResponse> usedCoupons = new HashSet<>();

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AddressResponse {
        private String name;
        private String locality;
        private String city;
        private String state;
        private String pinCode;
        private String mobile;
        private String address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponResponse {

        private String code;
        private Double discountInPercentage;
        private Double minimumOrderValue;

    }



}
