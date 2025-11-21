package com.vendor_marketplace.utils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CommonUtil {

    public static int calculateDiscountPercentage(int totalMrpPrice, int totalSellingPrice) {

        if (totalMrpPrice <= 0) {
            throw new IllegalArgumentException("MRP (Maximum Retail Price) price must be greater then 0");
        }
        if (totalSellingPrice < 0) {
            throw new IllegalArgumentException("Selling price cannot be negative");
        }
        if (totalSellingPrice > totalMrpPrice) {
            throw new IllegalArgumentException("Selling price cannot be greater than MRP price");
        }
        log.info("Maximum Retail Price: {}", totalMrpPrice);
        log.info("Selling Price: {}", totalSellingPrice);
        double discount = totalMrpPrice - totalSellingPrice;
        log.info("Discount: {}", discount);
        double discountPercentage = (discount / totalMrpPrice) * 100;
        log.info("DiscountPercentage: {}", discountPercentage);
        return (int) discountPercentage;
    }

    public static long convertPKRToDollar(long totalAmount) {
        double usdAmount = totalAmount / 280.0; // PKR to USD
        // USD to cents
        return (long) (usdAmount * 100);
    }
}
