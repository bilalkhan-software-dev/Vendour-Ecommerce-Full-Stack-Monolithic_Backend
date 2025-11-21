package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.entity.Category;
import com.vendor_marketplace.mapper.ProductMapper;
import com.vendor_marketplace.repository.CategoryRepository;
import com.vendor_marketplace.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Override
    public List<ProductResponse.ProductCategory> fetchAllCategories() {

        List<Category> all = categoryRepository.findAll();

        return all.stream().map(ProductMapper::mapToCategory).toList();
    }

    @Override
    public List<ProductResponse.ProductCategory> fetchLevelOneCategories() {

        List<Category> byCategoryLevel = categoryRepository.findByLevel(1);

        return byCategoryLevel.stream().map(ProductMapper::mapToCategory).toList();

    }

    @Override
    public List<ProductResponse.ProductCategory> fetchLevelTwoCategories() {

        List<Category> byCategoryLevel = categoryRepository.findByLevel(2);

        return byCategoryLevel.stream().map(ProductMapper::mapToCategory).toList();
    }

    @Override
    public List<ProductResponse.ProductCategory> fetchLevelThreeCategories() {

        List<Category> byCategoryLevel = categoryRepository.findByLevel(3);

        return byCategoryLevel.stream().map(ProductMapper::mapToCategory).toList();
    }
}
