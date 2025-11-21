package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.PagedResponse;
import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.dto.response.ProductSearchResponse;
import com.vendor_marketplace.endpoint.ProductControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
public class ProductController implements ProductControllerEndpoint {

    private final ProductService productService;
    private final GenericResponseHandler response;


    @Override
    public ResponseEntity<?> getAllProducts(String categoryId, String productTitle, String brand, String color, String size, String sort, String stock, Integer maxPrice, Integer minPrice, Integer minDiscount, Integer pageNumber) {
        log.info("Receive param requests =>  categoryId:{} color:{} size:{} sort:{} stock:{} maxPrice:{} minPrice:{} minDiscount:{}", categoryId, color, size, sort, stock, maxPrice, minPrice, minDiscount);

        PagedResponse<ProductResponse> allProducts = productService.findAllProducts(productTitle, categoryId, brand, color, size, minPrice, maxPrice, minDiscount, sort, stock, pageNumber);

        if (!CollectionUtils.isEmpty(allProducts.getContent())) {
            return response.createBuildResponse("Retrieved all product also filtered! Total Products: " + allProducts.getContent().size(), allProducts, HttpStatus.OK);
        }

        return response.createBuildResponse("No products found. Try adjusting your filters!", allProducts, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> searchProduct(String query) {

        List<ProductSearchResponse> productResponses = productService.searchProduct(query);

        if (!CollectionUtils.isEmpty(productResponses)) {
            return response.createBuildResponse("Searched Result of: " + query + " Total Products: " + productResponses.size(), productResponses, HttpStatus.OK);
        }


        return response.createBuildResponse("No product matches with query: " + query, productResponses, HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<?> getProductById(Long productId) {

        ProductResponse productById = productService.findProductById(productId);
        return response.createBuildResponse("Product details retrieved successfully!", productById, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getSimilarProducts(Long productId) {

        List<ProductResponse> similarProducts = productService.similarProducts(productId);

        if (CollectionUtils.isEmpty(similarProducts)){
            return response.createBuildResponse("No similar products found",similarProducts,HttpStatus.OK);
        }

        return response.createBuildResponse("Product details retrieved successfully!", similarProducts, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> getTopSellProducts(int limit) {
        List<ProductResponse> productResponses = productService.ourSellProducts(limit);

        if (!CollectionUtils.isEmpty(productResponses)) {

            return response.createBuildResponse(
                    String.format("Top %d Best-Selling Products fetched successfully. Total items: %d",
                            limit, productResponses.size()),
                    productResponses,
                    HttpStatus.OK
            );
        }

        return response.createErrorResponse(
                "No products have been sold yet. The best-sellers list is empty.",
                Collections.emptyList(),
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<?> getRecentOrderProducts(int limit) {
        List<ProductResponse> productResponses = productService.recentOrderProducts(limit);

        if (!CollectionUtils.isEmpty(productResponses)) {
            return response.createBuildResponse(
                    String.format("Recently sold products fetched successfully. Showing %d most recent items",
                            productResponses.size()),
                    productResponses,
                    HttpStatus.OK
            );
        }

        return response.createErrorResponse(
                "No recent orders found or products haven't been delivered yet.",
                Collections.emptyList(),
                HttpStatus.OK
        );
    }

}
