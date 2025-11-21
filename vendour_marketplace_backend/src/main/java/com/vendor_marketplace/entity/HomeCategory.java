package com.vendor_marketplace.entity;

import com.vendor_marketplace.entity.enums.HomeCategorySection;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class HomeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String image;
    private String categoryId;

    @Enumerated(EnumType.STRING)
    private HomeCategorySection homeCategorySection;

}
