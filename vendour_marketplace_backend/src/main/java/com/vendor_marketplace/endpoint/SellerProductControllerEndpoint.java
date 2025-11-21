package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.ProductCreateRequest;
import com.vendor_marketplace.dto.request.ProductSeoRequest;
import com.vendor_marketplace.dto.request.ProductUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping("/api/v1/sellers/product")
public interface SellerProductControllerEndpoint {

    @PostMapping("/add")
    ResponseEntity<?> addProduct(@RequestHeader(AUTHORIZATION_HEADER) String jwt, @Valid @RequestBody ProductCreateRequest productCreateRequest);

    @PutMapping("/update/{productId}")
    ResponseEntity<?> updateProduct(@PathVariable Long productId, @Valid @RequestBody ProductUpdateRequest productUpdateRequest);

    @DeleteMapping("/delete/{productId}")
    ResponseEntity<?> deleteProduct(@PathVariable Long productId);



    @GetMapping("/")
    ResponseEntity<?> getSellerProduct(@RequestHeader(AUTHORIZATION_HEADER) String jwt);

    @GetMapping("/{sellerId}")
    ResponseEntity<?> getProductBySellerId(@PathVariable Long sellerId);

    @PostMapping("/ask/ai")
    ResponseEntity<?> sellerSeoFriendlyProductSuggestion(@RequestBody ProductSeoRequest request);







}
