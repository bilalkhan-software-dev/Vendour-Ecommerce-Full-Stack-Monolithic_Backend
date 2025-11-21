package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Order;
import com.vendor_marketplace.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySeller_id(Long sellerId);

    boolean existsByOrder_OrderId(String orderId);

    boolean existsByOrder_Id(Long id);
}