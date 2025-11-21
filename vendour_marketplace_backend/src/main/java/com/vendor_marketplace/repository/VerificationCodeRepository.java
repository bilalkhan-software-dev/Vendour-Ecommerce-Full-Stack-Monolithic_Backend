package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmail(String email);

    @Query("select v from VerificationCode v where v.email = :email")
    VerificationCode findByEmailWithoutOptional(@Param("email") String email);
}