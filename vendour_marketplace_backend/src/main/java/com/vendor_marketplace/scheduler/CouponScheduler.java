package com.vendor_marketplace.scheduler;

import com.vendor_marketplace.repository.CouponRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponScheduler {

    private final CouponRepository couponRepository;

    // Runs every day at midnight (00:00)
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deactivateExpiredCoupons() {
        int updatedCount = couponRepository.deactivateExpiredCoupons(LocalDateTime.now());
        if (updatedCount > 0) {
            log.info("Deactivated {} expired coupons", updatedCount);
        }
    }
}

