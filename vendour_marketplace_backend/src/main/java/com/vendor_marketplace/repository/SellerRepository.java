package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Seller;
import com.vendor_marketplace.entity.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByEmail(String email);

    @Query("select s from Seller s where s.email = :email")
    Seller findByEmailWithoutOptional(@Param("email") String email);

    boolean existsByEmail(String email);

    List<Seller> findByAccountStatus(AccountStatus accountStatus);
}