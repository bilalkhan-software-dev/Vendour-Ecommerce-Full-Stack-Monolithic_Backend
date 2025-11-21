package com.vendor_marketplace.controller;


import com.vendor_marketplace.dto.request.SellerRequest;
import com.vendor_marketplace.dto.request.UpdateSellerRequest;
import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.dto.response.SellerResponse;
import com.vendor_marketplace.endpoint.SellerControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.SellerReportService;
import com.vendor_marketplace.services.SellerService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@Validated
public class SellerController implements SellerControllerEndpoint {

    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> registerSeller(SellerRequest sellerRequest) throws MessagingException, UnsupportedEncodingException {

        SellerResponse sellerResponse = sellerService.registerSeller(sellerRequest);
        if (!ObjectUtils.isEmpty(sellerResponse)) {
            return response.createBuildResponse("Seller registered successfully", sellerResponse, HttpStatus.CREATED);
        }

        return response.createBuildResponseMessage("Failed to register seller!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> getSellerProfile(String jwtToken) {
        SellerResponse sellerProfile = sellerService.getSellerProfile(jwtToken);
        if (!ObjectUtils.isEmpty(sellerProfile)) {
            return response.createBuildResponse("Seller profile retrieved successfully", sellerProfile, HttpStatus.OK);
        }
        return response.createBuildResponseMessage("Failed to retrieve seller profile!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> updateSellerProfile(String jwtToken, UpdateSellerRequest sellerRequest) {

        SellerResponse sellerResponse = sellerService.updateSellerProfile(jwtToken, sellerRequest);
        if (!ObjectUtils.isEmpty(sellerResponse)) {
            return response.createBuildResponse("Updated seller profile successfully", sellerResponse, HttpStatus.OK);
        }

        return response.createBuildResponseMessage("Failed to update seller profile!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> verifyEmail(String email, String otp) {

        SellerResponse isVerified = sellerService.verifySellerEmail(email, otp);
        if (!ObjectUtils.isEmpty(isVerified)) {
            return response.createBuildResponse("Seller verified successfully!", isVerified, HttpStatus.OK);
        }

        return response.createBuildResponseMessage("Seller verification failed! Try again later", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> resendEmailVerificationLink(String email) {

        sellerService.resendEmailVerification(email);

        return response.createBuildResponseMessage("Email verification link sent your email: " + email, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getSellerReport(String jwtToken) {

        SellerReportResponse sellerReport = sellerReportService.getSellerReport(jwtToken);

        return response.createBuildResponse("Seller report retrieved successfully", sellerReport, HttpStatus.OK);
    }
}
