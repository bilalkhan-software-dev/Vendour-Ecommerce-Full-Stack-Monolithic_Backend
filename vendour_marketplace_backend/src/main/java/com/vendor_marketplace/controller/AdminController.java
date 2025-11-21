package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.dto.response.SellerResponse;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.endpoint.AdminControllerEndpoint;
import com.vendor_marketplace.entity.SellerReport;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.mapper.SellerReportMapper;
import com.vendor_marketplace.services.SellerReportService;
import com.vendor_marketplace.services.SellerService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.entity.enums.AccountStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class AdminController implements AdminControllerEndpoint {

    private final SellerService sellerService;
    private final UserService userService;
    private final GenericResponseHandler response;
    private final SellerReportService sellerReportService;


    @Override
    public ResponseEntity<?> updateSellerAccountStatus(Long sellerId, AccountStatus accountStatus) {

        SellerResponse sellerResponse = sellerService.updateSellerAccountStatus(sellerId, accountStatus);
        if (!ObjectUtils.isEmpty(sellerResponse)) {
            return response.createBuildResponse("Seller account status update successfully", sellerResponse, HttpStatus.OK);
        }

        return response.createBuildResponseMessage("Seller account status update failed!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> getSellerByEmail(String email) {

        SellerResponse sellerByEmail = sellerService.getSellerByEmail(email);
        if (!ObjectUtils.isEmpty(sellerByEmail)) {
            return response.createBuildResponse("Seller retrieved successfully", sellerByEmail, HttpStatus.OK);
        }
        return response.createBuildResponseMessage("Failed to retrieve seller email!", HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @Override
    public ResponseEntity<?> getSellerById(Long sellerId) {
        SellerResponse sellerById = sellerService.getSellerById(sellerId);
        if (!ObjectUtils.isEmpty(sellerById)) {
            return response.createBuildResponse("Seller retrieved successfully", sellerById, HttpStatus.OK);
        }
        return response.createBuildResponseMessage("Failed to retrieve seller id!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> deleteSellerById(Long sellerId) {

        sellerService.deleteSellerById(sellerId);
        return response.createBuildResponseMessage("Deleted seller successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteSellerByEmail(String email) {

        sellerService.deleteSellerByEmail(email);
        return response.createBuildResponseMessage("Deleted seller by email successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllSellers() {
        List<SellerResponse> allRegisteredSellers = sellerService.getAllSellers();
        if (!CollectionUtils.isEmpty(allRegisteredSellers)) {
            return response.createBuildResponse("All registered retrieved successfully", allRegisteredSellers, HttpStatus.OK);
        }


        return response.createErrorResponse("No seller is registered", allRegisteredSellers, HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<?> getAllSellersByAccountStatus(AccountStatus accountStatus) {
        List<SellerResponse> allSellerFilterByAccountStatus = sellerService.getSellersByAccountStatus(accountStatus);
        if (!CollectionUtils.isEmpty(allSellerFilterByAccountStatus)) {
            return response.createBuildResponse("Seller filter by account status  retrieved successfully", allSellerFilterByAccountStatus, HttpStatus.OK);
        }


        return response.createErrorResponse("No seller is registered", allSellerFilterByAccountStatus, HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<?> getAllUsers() {

        List<UserResponse> allUsers = userService.getAllUsers();

        if (!CollectionUtils.isEmpty(allUsers)) {
            return response.createBuildResponse("All users retrieved successfully", allUsers, HttpStatus.OK);
        }

        return response.createErrorResponse("No users are registered", allUsers, HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<?> getUserDetailById(Long userId) {
        return response.createBuildResponse("User details retrieved successfully!", userService.getUserDetailsById(userId), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getUserDetailByEmail(String email) {
        return response.createBuildResponse("User details retrieved successfully!", userService.getUserDetailsByEmail(email), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getSellerReportById(Long sellerId) {

        SellerReport sellerReportBySellerId = sellerReportService.getSellerReportBySellerId(sellerId);
        SellerReportResponse sellerReportResponse = SellerReportMapper.toSellerReportResponse(sellerReportBySellerId);


        return response.createBuildResponse("Seller report retrieved successfully!", sellerReportResponse, HttpStatus.OK);
    }
}

