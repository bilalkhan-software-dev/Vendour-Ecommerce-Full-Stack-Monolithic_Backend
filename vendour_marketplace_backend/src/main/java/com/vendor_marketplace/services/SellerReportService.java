package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.entity.SellerReport;

public interface SellerReportService {

    SellerReportResponse getSellerReport(String jwt);
    SellerReport getSellerReportBySellerId(Long sellerId);

    void updateSellerReport(SellerReport sellerReport);



}
