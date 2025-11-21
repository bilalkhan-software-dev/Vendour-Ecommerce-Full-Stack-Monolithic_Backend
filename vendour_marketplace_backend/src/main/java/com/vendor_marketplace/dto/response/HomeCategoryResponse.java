package com.vendor_marketplace.dto.response;


import com.vendor_marketplace.entity.enums.HomeCategorySection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeCategoryResponse {

    private Long id;

    private String name;
    private String image;
    private String categoryId;

    private HomeCategorySection homeCategorySection;


}
