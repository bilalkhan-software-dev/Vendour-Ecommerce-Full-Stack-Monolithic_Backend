package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Coupon;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.isActive = :active")
    List<Coupon> findByIsActive(@Param("active") boolean active);

    @Modifying
    @Transactional
    @Query("UPDATE Coupon c SET c.isActive = false WHERE c.endDate < :now AND c.isActive = true")
    int deactivateExpiredCoupons(@Param("now") LocalDateTime now);
}