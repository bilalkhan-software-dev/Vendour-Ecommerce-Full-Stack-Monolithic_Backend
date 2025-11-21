package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.CouponRequest;
import com.vendor_marketplace.dto.request.UpdateCouponRequest;
import com.vendor_marketplace.dto.response.CartResponse;
import com.vendor_marketplace.dto.response.CouponResponse;

import java.util.List;

public interface CouponService {

    CartResponse applyCoupon(String jwt, String couponCode);

    CartResponse removeCoupon(String jwt, String couponCode);

    CouponResponse findCouponById(Long couponId);

    // For admin only
    CouponResponse createCoupon(CouponRequest couponRequest);

    // For admin only
    List<CouponResponse> findAllCoupons(String couponStatus);

    // For admin only
    void deleteCoupon(Long couponId);

    // For admin only
    CouponResponse updateCoupon(Long coupon, UpdateCouponRequest couponRequest);

}
