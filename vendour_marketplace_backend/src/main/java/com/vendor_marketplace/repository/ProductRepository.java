package com.vendor_marketplace.repository;

import com.vendor_marketplace.dto.response.ProductSearchResponse;
import com.vendor_marketplace.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findBySeller_id(Long sellerId);



/*
    @Query("""
            select p
            from Product p
            where lower(p.title) like lower(concat('%', :query, '%'))
               or lower(p.description) like lower(concat('%', :query, '%'))
               or lower(p.category.name) like lower(concat('%', :query, '%'))
            """)
    List<Product> searchProduct(@Param("query") String query);
 */

    // optimize more because using join make both product and category table join and make it faster when finding
    @Query("""
            select new com.vendor_marketplace.dto.response.ProductSearchResponse(p.title,c.categoryId)
            from Product p
            join p.category c
            where lower(p.title) like lower(concat('%', :query, '%'))
               or lower(p.description) like lower(concat('%', :query, '%'))
               or lower(c.name) like lower(concat('%', :query, '%'))
            """)
    List<ProductSearchResponse> searchProduct(@Param("query") String query);

    List<Product> findByCategory_CategoryIdOrTitleContainsOrderByIdDesc(String categoryCategoryId, String title, Pageable pageable);
}