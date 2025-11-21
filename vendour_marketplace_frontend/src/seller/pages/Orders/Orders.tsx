import { IconButton, Tooltip } from "@mui/material";
import OrderTable from "./OrderTable";
import { RefreshRounded } from "@mui/icons-material";
import { fetchSellerOrders } from "../../../redux/slice/seller/sellerOrderSlice";
import { useAppDispatch } from "../../../redux/store";
import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";

const Orders = () => {

  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRefreshOrders = async () => {
    const result = await dispatch(fetchSellerOrders());
    if (fetchSellerOrders.rejected.match(result)) {
      setSnackbar({
        open: true,
        message: result.payload || "Unable to fetch orders. Please try again later.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className=''>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold mb-5">All Orders</h1>
          <IconButton>
            <Tooltip title="Refresh Orders" placement="top" arrow>
              <RefreshRounded onClick={handleRefreshOrders} />
            </Tooltip>
          </IconButton>
        </div>
        <OrderTable />
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

export default Orders;