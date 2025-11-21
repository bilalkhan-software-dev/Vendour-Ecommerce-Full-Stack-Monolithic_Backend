package com.vendor_marketplace.endpoint;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/api/v1/product")
public interface ProductControllerEndpoint {

    @GetMapping("/all/filter")
    ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String productTitle,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(defaultValue = "0") Integer pageNumber
    );

    @GetMapping("/search")
    ResponseEntity<?> searchProduct(@RequestParam(required = false) String query);

    @GetMapping("/{productId}")
    ResponseEntity<?> getProductById(@PathVariable("productId") Long productId);

    @GetMapping("/similar/{productId}")
    ResponseEntity<?> getSimilarProducts(@PathVariable("productId") Long productId);

    @GetMapping("/topSellProducts")
    ResponseEntity<?> getTopSellProducts(@RequestParam(defaultValue = "10") int limit);

    @GetMapping("/recentOrderProduct")
    ResponseEntity<?> getRecentOrderProducts(@RequestParam(defaultValue = "10") int limit);
}
