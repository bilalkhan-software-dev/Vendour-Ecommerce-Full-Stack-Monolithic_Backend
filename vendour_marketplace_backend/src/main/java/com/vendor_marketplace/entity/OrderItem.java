package com.vendor_marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Order order;

    @ManyToOne
    private Product product;


    private String size;
    private int quantity;
    private Integer mrpPrice;
    private Integer sellingPrice;

    private Integer couponDiscountAmount;

    private Integer originalSellingPrice; // Price before coupon

    private Long userId;


}
