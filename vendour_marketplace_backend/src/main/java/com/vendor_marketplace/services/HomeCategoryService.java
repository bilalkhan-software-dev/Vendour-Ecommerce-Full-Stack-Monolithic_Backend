package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.HomeCategoryRequest;
import com.vendor_marketplace.dto.request.UpdateHomeCategoryRequest;
import com.vendor_marketplace.dto.response.HomeCategoryResponse;
import com.vendor_marketplace.entity.Home;

import java.util.List;

public interface HomeCategoryService {

    HomeCategoryResponse createHomeCategory(HomeCategoryRequest homeCategoryRequest);

    HomeCategoryResponse updateHomeCategory(Long homeCategoryId, UpdateHomeCategoryRequest homeCategoryRequest);

    void deleteHomeCategory(Long homeCategoryId);

    Home createHomeCategories(List<HomeCategoryRequest> homeCategoryRequests);

    Home getHomeCategories();


}
