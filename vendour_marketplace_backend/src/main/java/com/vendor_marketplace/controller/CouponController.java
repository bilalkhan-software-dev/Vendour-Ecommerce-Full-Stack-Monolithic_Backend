package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.CouponRequest;
import com.vendor_marketplace.dto.request.UpdateCouponRequest;
import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.dto.response.CouponResponse;
import com.vendor_marketplace.endpoint.CouponControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.CouponService;
import com.vendor_marketplace.utils.RedisUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class CouponController implements CouponControllerEndpoint {

    private final CouponService couponService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> customerApplyCouponToProduct(String jwt, String apply, String couponCode) {

        if (apply.equals("true")) {
            CartResponse cartResponse = couponService.applyCoupon(jwt, couponCode);
            return response.createBuildResponse("Coupon applied successfully!", cartResponse, HttpStatus.OK);
        } else {
            CartResponse cartResponse = couponService.removeCoupon(jwt, couponCode);
            return response.createBuildResponse("Coupon removed successfully!", cartResponse, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<?> customerRemoveCouponFromProduct(String jwt, String apply, String couponCode) {

        if (!apply.equals("true")) {
            CartResponse cartResponse = couponService.removeCoupon(jwt, couponCode);
            return response.createBuildResponse("Coupon removed successfully!", cartResponse, HttpStatus.OK);
        } else {
            return response.createBuildResponseMessage("Please select apply false to remove coupon", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> allCoupons(String CouponStatus) {



        List<CouponResponse> allCoupons = couponService.findAllCoupons(CouponStatus);
        if (!CollectionUtils.isEmpty(allCoupons)) {
            return response.createBuildResponse("Coupons found!", allCoupons, HttpStatus.OK);
        }

        return response.createErrorResponse("You currently does not have any coupon in your account", null, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> createCoupon(CouponRequest couponRequest) {

        CouponResponse coupon = couponService.createCoupon(couponRequest);

        if (!ObjectUtils.isEmpty(coupon)) {
            return response.createBuildResponse("Coupon created successfully!", coupon, HttpStatus.OK);
        }

        return response.createErrorResponse("Failed to add coupon!", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> deleteCoupon(Long couponId) {

        couponService.deleteCoupon(couponId);

        return response.createBuildResponseMessage("Coupon deleted successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateCoupon(Long couponId, UpdateCouponRequest updateCouponRequest) {

        CouponResponse couponResponse = couponService.updateCoupon(couponId, updateCouponRequest);

        return response.createBuildResponse("Coupon updated successfully!", couponResponse, HttpStatus.OK);
    }
}
