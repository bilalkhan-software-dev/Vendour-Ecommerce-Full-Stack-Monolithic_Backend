package com.vendor_marketplace.entity;

import com.vendor_marketplace.entity.enums.PaymentMethod;
import com.vendor_marketplace.entity.enums.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private Long amount;

    @Enumerated(EnumType.STRING)
    private PaymentOrderStatus paymentOrderStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

   /*
   This should be transactional reference number (pp_TxnRefNo) or session -> payment id for stripe
    */
    @Column(unique = true)
    private String paymentLinkId;

    @ManyToOne
    private User user;

    @OneToMany
    private Set<Order> orders = new HashSet<>();


}
