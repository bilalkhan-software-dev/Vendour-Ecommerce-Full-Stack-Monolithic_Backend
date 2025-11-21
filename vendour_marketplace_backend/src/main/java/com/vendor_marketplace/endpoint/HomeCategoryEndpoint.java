package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.HomeCategoryRequest;
import com.vendor_marketplace.dto.request.UpdateHomeCategoryRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.vendor_marketplace.utils.Constants.FOR_ADMIN_ONLY;

@RestController
@RequestMapping("/api/v1/home")
public interface HomeCategoryEndpoint {

    @PreAuthorize(FOR_ADMIN_ONLY)
    @PostMapping("/admin/create/categories")
    ResponseEntity<?> createHomeCategories(
            @Valid @RequestBody List<HomeCategoryRequest> homeCategoryRequests
            );

    @PreAuthorize(FOR_ADMIN_ONLY)
    @PostMapping("/admin/create/category")
    ResponseEntity<?> createHomeCategory(
            @Valid @RequestBody HomeCategoryRequest homeCategoryRequests
            );


    @GetMapping("/")
    ResponseEntity<?> getHomeCategory();

    @PreAuthorize(FOR_ADMIN_ONLY)
    @PatchMapping("/admin/update/{homeCategoryId}")
        ResponseEntity<?> updateHomeCategory(
                @PathVariable Long homeCategoryId,
                @Valid @RequestBody UpdateHomeCategoryRequest homeCategoryRequests
        );

    @PreAuthorize(FOR_ADMIN_ONLY)
    @DeleteMapping("/admin/delete/{homeCategoryId}")
    ResponseEntity<?> deleteHomeCategory(@PathVariable Long homeCategoryId);


}
