package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_id(Long productId);

    List<Review> findByUser_Id(Long userId);
}