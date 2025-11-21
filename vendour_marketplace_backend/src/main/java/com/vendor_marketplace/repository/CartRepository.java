package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Cart;
import com.vendor_marketplace.entity.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);


}