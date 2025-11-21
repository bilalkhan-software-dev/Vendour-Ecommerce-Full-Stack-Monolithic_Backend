import type { SellerResponse } from "./seller";

export interface SellerReportResponse {
    sellerReportId?: number;

    seller: Partial<SellerResponse>;
    totalEarnings: number;
    totalSales: number;
    totalRefunds: number;
    totalTax: number;
    netEarnings: number;
    totalOrders: number;
    cancelOrders: number;
    totalTransactions: number;
}
