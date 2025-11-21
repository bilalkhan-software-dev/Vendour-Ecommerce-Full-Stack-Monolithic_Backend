package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.response.TransactionResponse;
import com.vendor_marketplace.entity.Order;
import com.vendor_marketplace.entity.Seller;
import com.vendor_marketplace.entity.Transaction;
import com.vendor_marketplace.mapper.TransactionMapper;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.repository.TransactionRepository;
import com.vendor_marketplace.services.SellerService;
import com.vendor_marketplace.services.TransactionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;
    private final SellerService sellerService;

    @Override
    public void createTransaction(Order orders) {

        Seller seller = sellerRepository.findById(orders.getSellerId()).orElseThrow(() -> new EntityNotFoundException("Seller not found"));

        Transaction transaction = Transaction.builder()
                .createdAt(LocalDateTime.now())
                .customer(orders.getUser())
                .order(orders)
                .seller(seller)
                .build();

        TransactionMapper.toTransactionResponse(transactionRepository.save(transaction));
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {

        return transactionRepository.findAll().stream().map(TransactionMapper::toTransactionResponse).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getTransactionBySellerId(Long id) {

        List<Transaction> bySellerId = transactionRepository.findBySeller_id(id);

        return bySellerId.stream().map(TransactionMapper::toTransactionResponse).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getTransactionBySeller(String jwt) {

        Seller seller = sellerService.getSellerFromJwt(jwt);

        List<Transaction> bySellerId = transactionRepository.findBySeller_id(seller.getId());

        return bySellerId.stream().map(TransactionMapper::toTransactionResponse).collect(Collectors.toList());
    }
}
