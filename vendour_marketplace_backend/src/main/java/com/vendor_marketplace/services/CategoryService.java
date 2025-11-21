package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.response.ProductResponse;

import java.util.List;

public interface CategoryService {

    List<ProductResponse.ProductCategory> fetchAllCategories();

    List<ProductResponse.ProductCategory> fetchLevelOneCategories();

    List<ProductResponse.ProductCategory> fetchLevelTwoCategories();

    List<ProductResponse.ProductCategory> fetchLevelThreeCategories();

}
