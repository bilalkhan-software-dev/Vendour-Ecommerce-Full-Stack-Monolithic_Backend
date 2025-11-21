package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerResponse {

    private Long id;
    private String email;
    private String name;
    private String mobile;
    private String STRN;
    private String role;
    private Boolean emailVerified;
    private String accountStatus;

    private SellerBusinessDetails sellerBusinessDetails;
    private SellerBankDetails sellerBankDetails;
    private Address pickupAddress;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SellerBusinessDetails {
        private String businessName;
        private String businessAddress;
        private String businessMobileNumber;
        private String businessEmail;
        private String logo;
        private String banner;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SellerBankDetails {
        private String accountNumber;
        private String bankName;
        private String accountHolderName;
        private String IBAN;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Address {
        private Long id;
        private String name;
        private String locality;
        private String city;
        private String state;
        private String pinCode;
        private String mobile;
        private String address;
    }


}
