package com.vendor_marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double rating;

    @ElementCollection
    @Builder.Default
    private List<String> productImages = new ArrayList<>();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(
            name = "product_id",
            nullable = false
    )
    private Product product;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @CreationTimestamp
    private LocalDateTime reviewDate;


    private LocalDateTime updateReviewDate;


}
