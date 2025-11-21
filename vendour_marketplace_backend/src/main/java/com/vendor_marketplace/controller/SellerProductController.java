package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.ProductCreateRequest;
import com.vendor_marketplace.dto.request.ProductSeoRequest;
import com.vendor_marketplace.dto.request.ProductUpdateRequest;
import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.dto.response.ProductSeoResponse;
import com.vendor_marketplace.endpoint.SellerProductControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.ChatBotService;
import com.vendor_marketplace.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class SellerProductController implements SellerProductControllerEndpoint {

    private final ProductService productService;
    private final GenericResponseHandler response;
    private final ChatBotService chatBotService;


    @Override
    public ResponseEntity<?> addProduct(String jwt, ProductCreateRequest productCreateRequest) {

        ProductResponse product = productService.createProduct(productCreateRequest, jwt);

        if (product != null) {
            return response.createBuildResponse("Product added successfully!", product, HttpStatus.CREATED);
        }

        return response.createBuildResponseMessage("Failed to add product", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> updateProduct(Long productId, ProductUpdateRequest productUpdateRequest) {

        ProductResponse productResponse = productService.updateProduct(productId, productUpdateRequest);

        return response.createBuildResponse("Product updated successfully!", productResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteProduct(Long productId) {

        productService.deleteProduct(productId);

        return response.createBuildResponseMessage("Product deleted successfully with id: " + productId + " !", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getSellerProduct(String jwt) {

        List<ProductResponse> productBySeller = productService.getProductBySeller(jwt);

        if (!CollectionUtils.isEmpty(productBySeller)) {
            return response.createBuildResponse("Seller products fetched successfully! Total Products: " + productBySeller.size(), productBySeller, HttpStatus.OK);
        }

        return ResponseEntity.noContent().build();

    }

    @Override
    public ResponseEntity<?> getProductBySellerId(Long sellerId) {
        List<ProductResponse> productBySeller = productService.getProductBySellerId(sellerId);

        if (!CollectionUtils.isEmpty(productBySeller)) {
            return response.createBuildResponse("Seller products by ID fetched successfully! Total Products: " + productBySeller.size(), productBySeller, HttpStatus.OK);
        }

        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> sellerSeoFriendlyProductSuggestion(ProductSeoRequest request) {

        ProductSeoResponse productSeoResponse = chatBotService.sellerSeoFriendlyProductSuggestion(request);

        return response.createBuildResponse("AI SEO Friendly Product Title, Description Suggestion", productSeoResponse, HttpStatus.OK);
    }
}
