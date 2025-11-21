package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.SellerReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerReportRepository extends JpaRepository<SellerReport, Long> {

    SellerReport findBySellerId(Long sellerId);

}