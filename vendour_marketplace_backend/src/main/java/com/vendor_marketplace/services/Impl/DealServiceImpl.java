package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.request.DealRequest;
import com.vendor_marketplace.dto.request.UpdateDealRequest;
import com.vendor_marketplace.dto.response.DealResponse;
import com.vendor_marketplace.entity.Deal;
import com.vendor_marketplace.entity.HomeCategory;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.DealMapper;
import com.vendor_marketplace.repository.DealRepository;
import com.vendor_marketplace.repository.HomeCategoryRepository;
import com.vendor_marketplace.services.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;
    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    public DealResponse createDeal(DealRequest dealRequest) {


        // The admin can provide discount and category of id which he wants to add deal = Details below =
        HomeCategory homeCategory = homeCategoryRepository.findById(dealRequest.getHomeCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HomeCategory not found with id: " + dealRequest.getHomeCategory().getId()
                ));

        Deal deal = Deal.builder()
                .discount(dealRequest.getDiscount())
                .homeCategory(homeCategory)
                .build();

        Deal savedDeal = dealRepository.save(deal);

        return DealMapper.toDealResponse(savedDeal);
    }


    @Override
    public DealResponse updateDeal(Long dealId, UpdateDealRequest dealRequest) {


        // if admin want to apply deal into another category
        HomeCategory homeCategory = homeCategoryRepository.findById(dealRequest.getHomeCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HomeCategory not found with id: " + dealRequest.getHomeCategory().getId()
                ));


        Deal existingDeal = dealRepository.findById(dealId).orElseThrow(
                () -> new ResourceNotFoundException("Deal not found with id: " + dealId)
        );

        if (dealRequest.getDiscount() != null) {
            existingDeal.setDiscount(dealRequest.getDiscount());
        }

        if (dealRequest.getHomeCategory().getId() != null) {
            existingDeal.setHomeCategory(homeCategory);
        }

        return DealMapper.toDealResponse(dealRepository.save(existingDeal));
    }

    @Override
    public void deleteDeal(Long dealId) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(
                () -> new ResourceNotFoundException("Deal not found with id: " + dealId)
        );

        dealRepository.delete(deal);
    }


    @Override
    public List<DealResponse> allDeal() {

        List<Deal> deals = dealRepository.findAll();
        return deals.stream()
                .map(DealMapper::toDealResponse)
                .collect(Collectors.toList());
    }

    // Low level design of deal service
    /*
    Admin Panel: Admin creates deals by selecting a category + entering discount % → saved in DB.
    Homepage: When customers open the website, frontend fetches deals (/api/v1/deals) → shows banners like “Up to 50% off on Fashion!”.
    Product Listings: If you integrate discounts at product level, the website can automatically apply the deal when showing prices for products under that HomeCategory.
    Cart & Checkout: The discount can be applied when the user adds products to the cart, reducing total price.
     */
}
