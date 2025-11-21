package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.TransactionResponse;
import com.vendor_marketplace.endpoint.TransactionControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class TransactionController implements TransactionControllerEndpoint {

    private final TransactionService transactionService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> getAllTransactions() {

        List<TransactionResponse> allTransactions = transactionService.getAllTransactions();

        if (!CollectionUtils.isEmpty(allTransactions)) {
            return response.createBuildResponse("All transaction retrieved successfully!", allTransactions, HttpStatus.OK);
        }

        return response.createBuildResponse("You currently did not have any transaction!", allTransactions, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getTransactionOfTheSellerById(Long sellerId) {

        List<TransactionResponse> transactionBySellerId = transactionService.getTransactionBySellerId(sellerId);
        if (!CollectionUtils.isEmpty(transactionBySellerId)) {
            return response.createBuildResponse("All transaction retrieved successfully!", transactionBySellerId, HttpStatus.OK);
        }

        return response.createBuildResponse("You currently did not have any transaction!", transactionBySellerId, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> getSellerTransactions(String jwt) {

        List<TransactionResponse> transactionBySeller = transactionService.getTransactionBySeller(jwt);

        if (!CollectionUtils.isEmpty(transactionBySeller)) {
            return response.createBuildResponse("All transaction retrieved successfully!", transactionBySeller, HttpStatus.OK);
        }

        return response.createBuildResponse("You currently did not have any transaction!", transactionBySeller, HttpStatus.OK);

    }
}
