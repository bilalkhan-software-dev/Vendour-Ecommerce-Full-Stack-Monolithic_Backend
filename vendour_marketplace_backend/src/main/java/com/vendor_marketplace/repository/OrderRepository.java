package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_id(Long userId);

    List<Order> findBySellerId(Long sellerId);

    Optional<Order> findByOrderId(String orderId);

}