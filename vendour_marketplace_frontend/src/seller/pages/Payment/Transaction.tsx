import { HistoryRounded, RefreshRounded } from "@mui/icons-material";
import TransactionTable from "./TransactionTable";
import { useAppDispatch } from "../../../redux/store";
import { fetchSellerTransactions } from "../../../redux/slice/seller/sellerOrderSlice";
import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import { IconButton, Tooltip } from "@mui/material";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";

const Transaction = () => {

    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleRefreshTransactions = async () => {

        const result = await dispatch(fetchSellerTransactions());
        if (fetchSellerTransactions.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to fetch transactions. Please try again later.",
                severity: "error",
            });
        }
    };

    return (
        <>
            <div className=''>
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold mb-5">Your Transaction History <HistoryRounded /> </h1>
                    <IconButton>
                        <Tooltip title="Refresh Transactions">
                            <RefreshRounded onClick={handleRefreshTransactions} />
                        </Tooltip>
                    </IconButton>
                </div>

                <TransactionTable />
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

export default Transaction;