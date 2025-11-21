package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByPaymentLinkId(String paymentLinkId);
}