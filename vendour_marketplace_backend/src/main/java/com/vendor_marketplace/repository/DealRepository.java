package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
}