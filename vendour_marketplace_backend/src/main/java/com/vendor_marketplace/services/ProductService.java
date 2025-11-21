package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.ProductCreateRequest;
import com.vendor_marketplace.dto.request.ProductUpdateRequest;
import com.vendor_marketplace.dto.response.PagedResponse;
import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.dto.response.ProductSearchResponse;

import java.util.List;


public interface ProductService {

    ProductResponse createProduct(ProductCreateRequest productCreateRequest, String jwt);

    void deleteProduct(Long productId);

    ProductResponse updateProduct(Long productId, ProductUpdateRequest productUpdateRequest);

    ProductResponse findProductById(Long productId);

    List<ProductSearchResponse> searchProduct(String query);

    PagedResponse<ProductResponse> findAllProducts(
            String name,
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    );

    List<ProductResponse> getAllProducts();

    List<ProductResponse> similarProducts(Long productId);

    List<ProductResponse> getProductBySeller(String jwt);

    List<ProductResponse> getProductBySellerId(Long sellerId);

    List<ProductResponse> ourSellProducts(int limit);

    List<ProductResponse> recentOrderProducts(int limit);

    void updateInventory(Long productId,int quantity);

}
