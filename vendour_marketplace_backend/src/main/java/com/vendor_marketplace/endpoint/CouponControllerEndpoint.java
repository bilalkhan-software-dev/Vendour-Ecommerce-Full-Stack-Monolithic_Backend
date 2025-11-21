package com.vendor_marketplace.endpoint;


import com.vendor_marketplace.dto.request.CouponRequest;
import com.vendor_marketplace.dto.request.UpdateCouponRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;
import static com.vendor_marketplace.utils.Constants.FOR_ADMIN_ONLY;


@RequestMapping("/api/v1/coupon")
public interface CouponControllerEndpoint {


    @PutMapping("/apply")
    ResponseEntity<?> customerApplyCouponToProduct(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @RequestParam String apply,
            @RequestParam String couponCode
    );

    @PutMapping("/remove")
    ResponseEntity<?> customerRemoveCouponFromProduct(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,
            @RequestParam String apply,
            @RequestParam String couponCode
    );


    @PreAuthorize(FOR_ADMIN_ONLY)
    @GetMapping("/coupons")
    ResponseEntity<?> allCoupons(
            @RequestParam(required = false) String CouponStatus
    );




    @PreAuthorize(FOR_ADMIN_ONLY)
    @PostMapping("/create")
    ResponseEntity<?> createCoupon(
            @Valid @RequestBody CouponRequest couponRequest);


    @PreAuthorize(FOR_ADMIN_ONLY)
    @DeleteMapping("/delete/{couponId}")
    ResponseEntity<?> deleteCoupon(
            @PathVariable Long couponId
    );

    @PreAuthorize(FOR_ADMIN_ONLY)
    @PutMapping("/update/{couponId}")
    ResponseEntity<?> updateCoupon(
            @PathVariable Long couponId,
            @Valid @RequestBody UpdateCouponRequest updateCouponRequest
    );

}
