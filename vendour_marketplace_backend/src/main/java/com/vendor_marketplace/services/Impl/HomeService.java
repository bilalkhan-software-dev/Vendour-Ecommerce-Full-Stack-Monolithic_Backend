package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.entity.Deal;
import com.vendor_marketplace.entity.Home;
import com.vendor_marketplace.entity.HomeCategory;
import com.vendor_marketplace.repository.DealRepository;
import com.vendor_marketplace.entity.enums.HomeCategorySection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final DealRepository dealRepository;

    Home createHomePageData(List<HomeCategory> categories) {

        List<HomeCategory> shopByCategories = categories.stream().filter(homeCategory -> homeCategory.getHomeCategorySection() == HomeCategorySection.SHOP_BY_CATEGORIES).toList();

        List<HomeCategory> dealCategories = categories.stream().filter(homeCategory -> homeCategory.getHomeCategorySection() == HomeCategorySection.DEALS).toList();

        List<HomeCategory> gridCategories = categories.stream().filter(homeCategory -> homeCategory.getHomeCategorySection() == HomeCategorySection.GRID).toList();

        List<HomeCategory> electronicsCategories = categories.stream().filter(homeCategory -> homeCategory.getHomeCategorySection() == HomeCategorySection.ELECTRONICS_CATEGORIES).toList();

        List<Deal> deals;
        if (dealRepository.findAll().isEmpty()) {
            List<Deal> dealList = categories.stream().filter(homeCategory -> homeCategory.getHomeCategorySection() == HomeCategorySection.DEALS)
                    .map(category -> new Deal(null, 10, category))
                    .toList();

            deals = dealRepository.saveAll(dealList);
        } else {
            deals = dealRepository.findAll();
        }


        return Home.builder()
                .electronicCategories(electronicsCategories)
                .shopByCategory(shopByCategories)
                .grid(gridCategories)
                .dealCategories(dealCategories)
                .deals(deals)
                .build();
    }


}
