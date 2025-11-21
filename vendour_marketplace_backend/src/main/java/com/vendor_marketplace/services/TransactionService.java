package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.response.TransactionResponse;
import com.vendor_marketplace.entity.Order;

import java.util.List;

public interface TransactionService {

    void createTransaction(Order orders);

    List<TransactionResponse> getAllTransactions();

    List<TransactionResponse> getTransactionBySellerId(Long sellerId);

    List<TransactionResponse> getTransactionBySeller(String jwt);


}
