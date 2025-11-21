package com.vendor_marketplace.repository;

import com.vendor_marketplace.entity.OrderItem;
import com.vendor_marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /*
    Scan all records in the order_items table
     *   Group order items by product_id
     *   Calculate the sum of quantity for each product group
     *   Sort the results by total quantity in descending order
     *   Return only the top :limit results
     *  What it returns:
     *   Returns List<Product> - the actual Product entities
     *   Only returns products that have been ordered (have order items)
     *   Ordered from highest to lowest total quantity sold
     *   Limited to the specified number of products
     */
    @Query("""
            select oi.product, sum(oi.quantity) as total
            from OrderItem oi
            group by oi.product
            order by total desc
            limit :limit
            """)
    List<Product> ourSellProducts(@Param("limit") int limit);


    /*
     * Step-by-step execution:
     * Join order_items with orders table on order_id
     * Filter only delivered orders (delivery_date IS NOT NULL)
     * Group order items by product_id
     * Calculate the sum of quantity for each product group
     * Sort by:
     * Primary: Most recent delivery date (MAX(o.delivery_date) DESC)
     * Secondary: Total quantity sold (total DESC) - as tie-breaker
     * Return top :limit results
     * What it returns:
     * Returns List<Product> - the actual Product entities
     * Only includes products from delivered orders
     * Prioritizes products from the most recently delivered orders
     * If multiple products have same delivery date, sorts by quantity sold
     */
    @Query("""
            select oi.product, sum(oi.quantity) as total
            from OrderItem oi
            join oi.order o
            where o.deliveryDate is not null
            group by oi.product
            order by max(o.deliveryDate) DESC, total DESC
            limit :limit
            """)
    List<Product> findRecentlySoldProducts(@Param("limit") int limit);
}