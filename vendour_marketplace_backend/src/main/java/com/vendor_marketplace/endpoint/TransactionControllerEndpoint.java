package com.vendor_marketplace.endpoint;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.vendor_marketplace.utils.Constants.*;

@RequestMapping("/api/v1/transaction")
public interface TransactionControllerEndpoint {

    @PreAuthorize(FOR_ADMIN_ONLY)
    @GetMapping("/")
    ResponseEntity<?> getAllTransactions();

    @PreAuthorize(FOR_ADMIN_ONLY)
    @GetMapping("/seller/{sellerId}")
    ResponseEntity<?> getTransactionOfTheSellerById(@PathVariable Long sellerId);


    @PreAuthorize(FOR_SELLER_ONLY)
    @GetMapping("/seller")
    ResponseEntity<?> getSellerTransactions(@RequestHeader(AUTHORIZATION_HEADER) String jwt);

}
