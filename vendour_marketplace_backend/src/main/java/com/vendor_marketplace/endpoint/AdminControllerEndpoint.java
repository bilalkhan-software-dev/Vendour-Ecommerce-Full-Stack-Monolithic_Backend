package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.entity.enums.AccountStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.FOR_ADMIN_ONLY;


@PreAuthorize(FOR_ADMIN_ONLY)
@RequestMapping("/api/v1/admin")
public interface AdminControllerEndpoint {

    @PutMapping("seller/update-status/{sellerId}")
    ResponseEntity<?> updateSellerAccountStatus(@PathVariable Long sellerId, @RequestParam AccountStatus accountStatus);

    @GetMapping("seller/detail/email/{email}")
    ResponseEntity<?> getSellerByEmail(@PathVariable String email);

    @GetMapping("seller/detail/id/{sellerId}")
    ResponseEntity<?> getSellerById(@PathVariable Long sellerId);

    @DeleteMapping("seller/delete/{sellerId}")
    ResponseEntity<?> deleteSellerById(@PathVariable Long sellerId);

    @DeleteMapping("seller/delete/{email}")
    ResponseEntity<?> deleteSellerByEmail(@PathVariable String email);

    @GetMapping("/sellers/")
    ResponseEntity<?> getAllSellers();

    @GetMapping("/seller/filter/{accountStatus}")
    ResponseEntity<?> getAllSellersByAccountStatus(@PathVariable AccountStatus accountStatus);

    @GetMapping("/users/")
    ResponseEntity<?> getAllUsers();


    @GetMapping("/user/detail/{userId}")
    ResponseEntity<?> getUserDetailById(@PathVariable Long userId);

    @GetMapping("/user/detail/{email}")
    ResponseEntity<?> getUserDetailByEmail(@PathVariable String email);

    @GetMapping("/seller/report/{sellerId}")
    ResponseEntity<?> getSellerReportById(@PathVariable Long sellerId);










}
