package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.TransactionResponse;
import com.vendor_marketplace.entity.Transaction;

public class TransactionMapper {

    public static TransactionResponse toTransactionResponse(Transaction transaction) {

        if (transaction == null) {
            return null;
        }

        return TransactionResponse.builder()
                .id(transaction.getId())
                .createdAt(transaction.getCreatedAt())
                .order(transaction.getOrder() != null ? OrderMapper.toOrderResponse(transaction.getOrder()) : null)
                .customer(transaction.getCustomer() != null ? UserMapper.toUserResponse(transaction.getCustomer()) : null)
                .seller(transaction.getSeller() != null ? SellerMapper.toSellerResponse(transaction.getSeller()) : null)
                .build();
    }
}
