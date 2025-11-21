package com.vendor_marketplace.mapper;

import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.entity.SellerReport;

public class SellerReportMapper {

    public static SellerReportResponse toSellerReportResponse(SellerReport sellerReport) {

        if (sellerReport == null) {
            return null;
        }

        return SellerReportResponse.builder()
                .sellerReportId(sellerReport.getId())
                .totalOrders(sellerReport.getTotalOrders())
                .seller(SellerMapper.toSellerResponse(sellerReport.getSeller()))
                .totalEarnings(sellerReport.getTotalEarnings())
                .netEarnings(sellerReport.getNetEarnings())
                .cancelOrders(sellerReport.getCancelOrders())
                .totalTransactions(sellerReport.getTotalTransactions())
                .totalRefunds(sellerReport.getTotalRefunds())
                .totalSales(sellerReport.getTotalSales())
                .totalTax(sellerReport.getTotalTax())
                .build();
    }

}
