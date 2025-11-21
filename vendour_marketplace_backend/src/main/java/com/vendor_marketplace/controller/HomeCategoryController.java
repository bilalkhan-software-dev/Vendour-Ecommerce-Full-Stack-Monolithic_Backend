package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.HomeCategoryRequest;
import com.vendor_marketplace.dto.request.UpdateHomeCategoryRequest;
import com.vendor_marketplace.dto.response.HomeCategoryResponse;
import com.vendor_marketplace.endpoint.HomeCategoryEndpoint;
import com.vendor_marketplace.entity.Home;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
@Validated
public class HomeCategoryController implements HomeCategoryEndpoint {

    private final HomeCategoryService homeCategoryService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> createHomeCategories(List<HomeCategoryRequest> homeCategoryRequests) {


        Home homeCategories = homeCategoryService.createHomeCategories(homeCategoryRequests);
        return response.createBuildResponse("Home page retrieved successfully!", homeCategories, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> createHomeCategory(HomeCategoryRequest homeCategoryRequests) {

        HomeCategoryResponse homeCategory = homeCategoryService.createHomeCategory(homeCategoryRequests);

        if (homeCategory != null) {
            return response.createBuildResponse("Home category created successfully!", homeCategory, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("Home category could not be created!", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<?> getHomeCategory() {

        Home homeCategories = homeCategoryService.getHomeCategories();


        return response.createBuildResponse("Home page categories retrieved successfully!", homeCategories, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateHomeCategory(Long homeCategoryId, UpdateHomeCategoryRequest homeCategoryRequests) {

        HomeCategoryResponse homeCategoryResponse = homeCategoryService.updateHomeCategory(homeCategoryId, homeCategoryRequests);

        return response.createBuildResponse("Home category updated successfully!", homeCategoryResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteHomeCategory(Long homeCategoryId) {

        homeCategoryService.deleteHomeCategory(homeCategoryId);

        return response.createBuildResponse("Home category deleted successfully!", homeCategoryId, HttpStatus.OK);
    }
}
