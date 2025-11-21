package com.vendor_marketplace.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.UUID;

import static com.vendor_marketplace.utils.Constants.OTP_LENGTH;

public class RandomUtil {

    public static String toGenerateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public static String toGenerateOrderId() {

        LocalDateTime now = LocalDateTime.now(); // 2025-08-30T23:15:45
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")); //20250830231545
        int randomSuffix = (int) (Math.random() * 1000); // 342

        return "ORD-" + timestamp + "-" + String.format("%03d", randomSuffix); // ORD-20250830231545-342
    }

    public static String toGenerateJazzCashTxnRefNo() {
        return UUID.randomUUID().toString().replace("-", ""); // e5d7a3d81c424f39a17a56c19db5b87c
    }


}
