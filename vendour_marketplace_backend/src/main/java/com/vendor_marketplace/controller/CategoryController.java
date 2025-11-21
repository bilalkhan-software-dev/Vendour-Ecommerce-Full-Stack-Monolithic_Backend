package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final GenericResponseHandler response;

    @GetMapping("/")
    ResponseEntity<?> allCategories() {
        List<ProductResponse.ProductCategory> productCategories = categoryService.fetchAllCategories();

        return response.createBuildResponse("All Categories", productCategories, HttpStatus.OK);
    }

    @GetMapping("/level/one")
    ResponseEntity<?> levelOneCategories() {
        List<ProductResponse.ProductCategory> productCategories = categoryService.fetchLevelOneCategories();

        return response.createBuildResponse("Level One Categories ", productCategories, HttpStatus.OK);
    }

    @GetMapping("/level/two")
    ResponseEntity<?> levelTwoCategories() {
        List<ProductResponse.ProductCategory> productCategories = categoryService.fetchLevelTwoCategories();

        return response.createBuildResponse("Level One Categories ", productCategories, HttpStatus.OK);
    }

    @GetMapping("/level/three")
    ResponseEntity<?> levelThreeCategories() {
        List<ProductResponse.ProductCategory> productCategories = categoryService.fetchLevelThreeCategories();

        return response.createBuildResponse("Level One Categories ", productCategories, HttpStatus.OK);
    }


}
