package com.vendor_marketplace.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(
        indexes = @Index(name = "idx_category_name", columnList = "name")
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    @NotNull
    private String categoryId;

    @ManyToOne
    private Category parentCategory;


    private Integer level;

    @PrePersist
    @PreUpdate
    private void normalizeCategoryId() {
        if (categoryId != null) {
            categoryId = categoryId.trim().toLowerCase().replace(" ", "_");
        }
    }
}
