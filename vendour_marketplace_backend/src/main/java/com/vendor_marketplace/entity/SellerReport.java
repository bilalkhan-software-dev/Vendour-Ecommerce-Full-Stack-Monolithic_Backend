package com.vendor_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SellerReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Seller seller;

    @Builder.Default
    private Long totalEarnings = 0L;

    @Builder.Default
    private Long totalSales = 0L;

    @Builder.Default
    private Long totalRefunds = 0L;

    @Builder.Default
    private Long totalTax = 0L;

    @Builder.Default
    private Long netEarnings = 0L;

    @Builder.Default
    private Integer totalOrders = 0;

    @Builder.Default
    private Integer cancelOrders = 0;

    @Builder.Default
    private Integer totalTransactions = 0;

}
