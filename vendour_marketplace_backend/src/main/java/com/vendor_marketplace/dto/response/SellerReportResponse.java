package com.vendor_marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerReportResponse {

    private Long sellerReportId;

    private SellerResponse seller;
    private Long totalEarnings;
    private Long totalSales;
    private Long totalRefunds;
    private Long totalTax;
    private Long netEarnings;
    private Integer totalOrders;
    private Integer cancelOrders;
    private Integer totalTransactions;

}
