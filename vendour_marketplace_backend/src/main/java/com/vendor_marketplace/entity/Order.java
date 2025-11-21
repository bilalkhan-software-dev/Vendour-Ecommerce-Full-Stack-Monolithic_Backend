package com.vendor_marketplace.entity;

import com.vendor_marketplace.entity.enums.OrderStatus;
import com.vendor_marketplace.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 1. MRP (Maximum Retail Price) in Pakistan
 * Meaning: Usually refers to the original listed price or manufacturer’s suggested retail price.
 * Note:
 * Pakistan does not have strict legal enforcement like India’s “cannot sell above MRP” law.
 * Retailers and online stores often use "MRP" just to show the original value before discount.
 * Sometimes called List Price or Original Price on websites.
 * Example:
 * Daraz lists a watch with MRP = Rs. 5,000.
 * 2. Net Price in Pakistan
 * Meaning: The final price the customer pays after discounts, coupons, and sometimes after adding taxes/shipping (depending on the platform’s display style).
 * Example:
 * MRP = Rs. 5,000
 * Discount = Rs. 1,000
 * Shipping = Rs. 200
 * Net Price = Rs. 5,000 - 1,000 + 200 = Rs. 4,200
 * 💡 On Pakistani e-commerce platforms (Daraz, HumMart, Telemart):
 * MRP = "Before Discount" price (often shown struck-through).
 * Net Price = "After Discount" or "You Pay" price.
 */

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;

    @ManyToOne
    private User user;

    private Long cartId;

    @Column(nullable = false)
    private Long sellerId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne
    private Address shippingAddress;

    @Embedded
    @Builder.Default
    private PaymentDetails paymentDetails = new PaymentDetails();

    private double totalMrpPrice;
    private Integer totalSellingPrice;
    private Integer totalItems; // total quantity
    private Integer discount;

    private String couponCode;

    private Integer couponDiscountAmount;

    private Integer originalSellingPrice; // Price before coupon

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.PLACED;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_payment_status")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime orderDate;



    @Builder.Default
    private LocalDateTime deliveryDate = LocalDateTime.now().plusDays(7);
}
