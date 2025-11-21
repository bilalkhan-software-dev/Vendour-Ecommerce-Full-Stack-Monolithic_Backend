package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Cart;
import com.vendor_marketplace.entity.CartItem;
import com.vendor_marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}