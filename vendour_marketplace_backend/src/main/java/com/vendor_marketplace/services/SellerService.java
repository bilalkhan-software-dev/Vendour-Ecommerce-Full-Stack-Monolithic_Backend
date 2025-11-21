package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.SellerRequest;
import com.vendor_marketplace.dto.request.UpdateSellerRequest;
import com.vendor_marketplace.dto.response.SellerResponse;
import com.vendor_marketplace.entity.Seller;
import com.vendor_marketplace.entity.enums.AccountStatus;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface SellerService {

    SellerResponse getSellerProfile(String jwtToken);
    Seller getSellerFromJwt(String jwtToken);

    SellerResponse registerSeller(SellerRequest sellerRequest) throws MessagingException, UnsupportedEncodingException;

    void resendEmailVerification(String email);

    SellerResponse getSellerById(Long sellerId);

    SellerResponse getSellerByEmail(String email);

    List<SellerResponse> getAllSellers();
    List<SellerResponse> getSellersByAccountStatus(AccountStatus accountStatus);

    SellerResponse updateSellerProfile(String jwtToken, UpdateSellerRequest sellerRequest);

    void deleteSellerById(Long sellerId);

    void deleteSellerByEmail(String email);

    SellerResponse verifySellerEmail(String email, String otp);

    SellerResponse updateSellerAccountStatus(Long sellerId, AccountStatus accountStatus);
}
