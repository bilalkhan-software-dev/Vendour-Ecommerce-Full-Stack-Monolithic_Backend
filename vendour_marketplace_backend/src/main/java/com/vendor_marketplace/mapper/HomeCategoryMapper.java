package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.HomeCategoryResponse;
import com.vendor_marketplace.entity.HomeCategory;

public class HomeCategoryMapper {

    public static HomeCategoryResponse toHomeCategoryResponse(HomeCategory homeCategory) {

        if (homeCategory == null) {
            return null;
        }

        return HomeCategoryResponse.builder()
                .id(homeCategory.getId())
                .name(homeCategory.getName())
                .image(homeCategory.getImage())
                .categoryId(homeCategory.getCategoryId())
                .homeCategorySection(homeCategory.getHomeCategorySection())
                .build();
    }


}
