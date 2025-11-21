package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserId(Long id);

    boolean existsByUserId(Long id);

    Optional<Wishlist> findByUser(User user);
}