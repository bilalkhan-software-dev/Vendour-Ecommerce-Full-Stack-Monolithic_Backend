import { Button, Card, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import TransactionTable from "./TransactionTable";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useEffect, useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import { fetchSellerReport } from "../../../redux/slice/seller/sellerSlice";
import { fetchSellerTransactions } from "../../../redux/slice/seller/sellerOrderSlice";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { MonetizationOn, ShoppingCart, Cancel, LocalAtm, Assessment } from "@mui/icons-material";

const Payment = () => {
  const { seller, sellerOrder } = useAppSelector(store => store);
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });

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

  const fetchTransactions = async () => {
    if (sellerOrder.transactions && sellerOrder.transactions.length > 0) return;

    const result = await dispatch(fetchSellerTransactions());
    if (fetchSellerTransactions.rejected.match(result)) {
      setSnackbar({
        open: true,
        message: result.payload || "Unable to fetch transactions. Please try again later.",
        severity: "error",
      });
    }
  };

 

  const report = seller.report;


  if (seller.loading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Summary Section */}
        <Card className="rounded-xl p-6 shadow-md space-y-5 bg-gradient-to-b from-white to-gray-50">
          <Typography variant="h5" className="font-semibold text-gray-700">
            Seller Summary
          </Typography>
          <Divider />

          {/* Metric Grid */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:shadow-md transition">
                <MonetizationOn className="text-blue-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Total Earnings</Typography>
                <Typography variant="h6" className="font-bold">Rs. {report?.totalEarnings ?? 0}</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-green-50 hover:shadow-md transition">
                <Assessment className="text-green-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Net Earnings</Typography>
                <Typography variant="h6" className="font-bold">Rs. {report?.netEarnings ?? 0}</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-indigo-50 hover:shadow-md transition">
                <ShoppingCart className="text-indigo-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Total Sales</Typography>
                <Typography variant="h6" className="font-bold">{report?.totalSales ?? 0}</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-red-50 hover:shadow-md transition">
                <Cancel className="text-red-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Cancelled Orders</Typography>
                <Typography variant="h6" className="font-bold">{report?.cancelOrders ?? 0}</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-orange-50 hover:shadow-md transition">
                <LocalAtm className="text-orange-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Total Refunds</Typography>
                <Typography variant="h6" className="font-bold">Rs. {report?.totalRefunds ?? 0}</Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className="p-4 shadow-sm rounded-lg flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:shadow-md transition">
                <Assessment className="text-purple-500" fontSize="large" />
                <Typography variant="subtitle2" className="text-gray-600">Total Tax</Typography>
                <Typography variant="h6" className="font-bold">Rs. {report?.totalTax ?? 0}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Card>

        {/* Transactions Section */}
        <div className="mt-10 space-y-3">
          <Button
            variant="contained"
            onClick={fetchTransactions}
            className="hover:bg-primary-color/100"
            sx={{marginBottom: 1}}
          >
            View Transactions
          </Button>

          <TransactionTable />
        </div>
      </div>

      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
};

export default Payment;
