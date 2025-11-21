package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
}