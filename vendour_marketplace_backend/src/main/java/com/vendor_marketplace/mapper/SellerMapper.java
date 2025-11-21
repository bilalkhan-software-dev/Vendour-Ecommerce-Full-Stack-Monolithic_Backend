package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.SellerResponse;
import com.vendor_marketplace.entity.Address;
import com.vendor_marketplace.entity.BankDetails;
import com.vendor_marketplace.entity.BusinessDetails;
import com.vendor_marketplace.entity.Seller;

public class SellerMapper {

    public static SellerResponse toSellerResponse(Seller seller) {
        if (seller == null) return null;

        BusinessDetails businessDetails = seller.getBusinessDetails();
        BankDetails bankDetails = seller.getBankDetails();
        Address pickupAddress = seller.getPickupAddress();

        return SellerResponse.builder()
                .id(seller.getId())
                .email(seller.getEmail())
                .name(seller.getName())
                .role(seller.getRole() != null ? seller.getRole().name() : null)
                .accountStatus(seller.getAccountStatus() != null ? seller.getAccountStatus().name() : null)
                .emailVerified(seller.isEmailVerified())
                .STRN(seller.getSTRN())
                .mobile(seller.getMobile())
                .sellerBusinessDetails(businessDetails != null ? SellerResponse.SellerBusinessDetails.builder()
                        .businessName(businessDetails.getBusinessName())
                        .businessAddress(businessDetails.getBusinessAddress())
                        .businessEmail(businessDetails.getBusinessEmail())
                        .logo(businessDetails.getLogo())
                        .banner(businessDetails.getBanner())
                        .businessMobileNumber(businessDetails.getBusinessMobileNumber())
                        .build() : null)
                .sellerBankDetails(bankDetails != null ? SellerResponse.SellerBankDetails.builder()
                        .bankName(bankDetails.getBankName())
                        .accountHolderName(bankDetails.getAccountHolderName())
                        .accountNumber(bankDetails.getAccountNumber())
                        .IBAN(bankDetails.getIBAN())
                        .build() : null)
                .pickupAddress(pickupAddress != null ? SellerResponse.Address.builder()
                        .id(pickupAddress.getId())
                        .address(pickupAddress.getAddress())
                        .city(pickupAddress.getCity())
                        .state(pickupAddress.getState())
                        .pinCode(pickupAddress.getPinCode())
                        .locality(pickupAddress.getLocality())
                        .mobile(pickupAddress.getMobile())
                        .name(pickupAddress.getName())
                        .build() : null)

                .build();
    }
}
