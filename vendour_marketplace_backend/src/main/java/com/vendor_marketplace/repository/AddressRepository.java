package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}