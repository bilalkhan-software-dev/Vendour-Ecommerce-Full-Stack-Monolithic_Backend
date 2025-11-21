package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.DealResponse;
import com.vendor_marketplace.entity.Deal;

public class DealMapper {

    public static DealResponse toDealResponse(Deal deal) {

        if (deal == null) {
            return null;
        }

        return DealResponse.builder()
                .id(deal.getId())
                .discount(deal.getDiscount())
                .homeCategory(HomeCategoryMapper.toHomeCategoryResponse(deal.getHomeCategory()))
                .build();
    }
}
