package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {


    Optional<Category> findByCategoryId(String categoryId);


    List<Category> findByLevel(int i);
}