import { Card, CardContent, Grid, Typography, Divider } from "@mui/material";
import { BarChart, PieChart, LineChart, useLegend } from "@mui/x-charts";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useEffect, useState } from "react";
import { fetchSellerReport } from "../../../redux/slice/seller/sellerSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";

const Dashboard = () => {
    const { report } = useAppSelector((store) => store.seller);




    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    // Compute monthly sales dynamically
    // const monthlySales = generateMonthlyReport(orders).map((m) => ({
    //     month: m.month,
    //     sales: m.totalSales,
    // }));

    useEffect(() => {
        const fetchReport = async () => {
            const result = await dispatch(fetchSellerReport());
            if (fetchSellerReport.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to fetch report. Please try again later.",
                    severity: "error",
                });
            }
        };
        fetchReport();
    }, [dispatch]);

    // // Fallback if report is missing
    const data = report || {
        totalEarnings: 0,
        totalSales: 0,
        totalRefunds: 0,
        totalTax: 0,
        netEarnings: 0,
        totalOrders: 0,
        cancelOrders: 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Typography variant="h5" className="font-semibold text-gray-700">
                Seller Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={2}>
                {[
                    { title: "Total Earnings", value: data.totalEarnings, color: "text-blue-600", isCurrency: true },
                    { title: "Net Earnings", value: data.netEarnings, color: "text-green-600", isCurrency: true },
                    { title: "Total Orders", value: data.totalOrders, color: "text-indigo-600" },
                    { title: "Cancelled Orders", value: data.cancelOrders, color: "text-red-600" },
                ].map((item, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card className="rounded-lg light-thin-border hover:shadow-lg transition-all duration-300">
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {item.title}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    className={`font-bold ${item.color} flex items-center gap-1`}
                                >
                                    {item.isCurrency && <span>Rs.</span>}
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider />

            {/* Charts */}
            <Grid container spacing={4}>
                {/* Bar Chart - Earnings Breakdown */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="rounded-lg light-thin-border hover:shadow-lg transition-all duration-300">
                        <CardContent>
                            <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                Earnings Breakdown
                            </Typography>
                            <BarChart
                                xAxis={[{ scaleType: "band", data: ["Sales", "Tax", "Refunds", "Net"] }]}
                                series={[
                                    {
                                        data: [data.totalSales, data.totalTax, data.totalRefunds, data.netEarnings],
                                        color: "#1DB954",
                                        label: "Earnings"
                                    },
                                ]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pie Chart - Order Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="rounded-lg light-thin-border hover:shadow-lg transition-all duration-300">
                        <CardContent>
                            <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                Order Distribution
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: data.totalOrders - data.cancelOrders, label: "Completed" },
                                            { id: 1, value: data.cancelOrders, label: "Cancelled" },
                                        ],
                                    },
                                ]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Line Chart - Monthly Sales
                <Grid size={{ xs: 12 }}>
                    <Card className="rounded-lg light-thin-border hover:shadow-lg transition-all duration-300">
                        <CardContent>
                            <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                Monthly Sales Trend
                            </Typography>
                            <LineChart
                                xAxis={[{ data: monthlySales.map((m) => m.month) }]}
                                series={[
                                    {
                                        data: monthlySales.map((m) => m.sales),
                                        color: "#10b981",
                                        label: "Sales",
                                    },
                                ]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </div>

    );
};

export default Dashboard;