package com.vendor_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.stereotype.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@Setter
@Table(
        indexes = {
                @Index(name = "idx_product_title", columnList = "title"),
                @Index(name = "idx_product_description_v2", columnList = "description"),
        }
)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 500)
    private String description;
    private Integer mrpPrice;
    private Integer sellingPrice;
    private Double discountInPercentage;

    @Column(nullable = false)
    @Builder.Default
    private int stocks = 0;

    private String color;
    private String brand;

    @ElementCollection
    @Builder.Default
    private List<String> images = new ArrayList<>();

    private int numRatings;

    @Builder.Default
    private Double averageRating = 0.0;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Seller seller;

    private LocalDateTime createdAt;

    private String sizes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();


/*
  The term mrpPrice usually refers to the Maximum Retail Price (MRP) of a product.
   MRP (Maximum Retail Price):
  It is the highest price that a seller is allowed to charge consumers for a product, as printed on the packaging.
  In many countries (like India and Pakistan), printing the MRP on packaged consumer goods is legally required.
  * Retailers cannot charge above MRP, but they may offer discounts and sell it for less.
   So mrpPrice in e-commerce/software systems:
  It's the original price set by the manufacturer (before any discount).
  You might also see a sellingPrice or netPrice field, which is the actual price after discounts or promotions.
  Example
  mrpPrice: 2000 PKR (printed on product)
  discount: 20%
  sellingPrice / netPrice: 1600 PKR
 */


}
