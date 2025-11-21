import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import type { TransactionResponse } from '../../../types/order';
import { useEffect, useState } from 'react';
import { fetchSellerTransactions } from '../../../redux/slice/seller/sellerOrderSlice';
import type { SnackbarProps } from '../../../types/props';
import { Box, CircularProgress, Typography } from '@mui/material';
import { EmailRounded, PhoneRounded } from '@mui/icons-material';
import SnackbarMessage from '../../../component/SnackbarMessage/SnackbarMessage';


export default function TransactionTable() {


    const sellerOrder = useAppSelector(store => store.sellerOrder);
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            const result = await dispatch(fetchSellerTransactions());
            if (fetchSellerTransactions.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message:
                        result.payload ||
                        "Unable to fetch transactions. Please try again later.",
                    severity: "error",
                });
            }
        };
        fetchTransactions();
    }, [dispatch]);


    if (sellerOrder.loading) {
        return (
            <div className="w-full h-[60vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} className='light-thin-border rounded-md ' aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell >Date</TableCell>
                            <TableCell align="left">Customer Info</TableCell>
                            <TableCell align="left">Order</TableCell>
                            <TableCell align="left">Amount</TableCell>
                            {/* <TableCell align="right">Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    {sellerOrder.transactions && sellerOrder.transactions.length > 0 ?
                        sellerOrder.transactions.map((data: TransactionResponse) => (
                            <TableBody>
                                <TableRow
                                    key={data.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    className="hover:bg-gray-100 cursor-pointer"
                                >
                                    <TableCell component="th" scope="row">
                                        {data.createdAt}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box display="flex" flexDirection="column" textAlign="left" gap={0.5}>
                                            <Typography fontWeight={600}>
                                                {data.customer.fullName || "Unknown"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <EmailRounded fontSize='small' color='info' /> {data.customer.email || "-"}
                                            </Typography>
                                            <Typography variant="body2">{data.customer.address?.[0].address}</Typography>
                                            <Typography variant="body2">
                                                {data.customer.address?.[0].locality}, {data.customer.address?.[0].city}
                                            </Typography>
                                            <Typography variant="body2">{data.customer.address?.[0].state}</Typography>
                                            <Typography variant="body2"><PhoneRounded fontSize="small" color='success' /> {data.customer.address?.[0].mobile}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box>
                                            <Typography fontWeight={600}>Order ID: {data.order.orderId}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Items: {data.order.orderItems.length}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Status:  <Typography
                                                    variant="body2"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: "12px",
                                                        color: "white",
                                                        bgcolor:
                                                            data.order.orderStatus === "DELIVERED"
                                                                ? "success.light"
                                                                : data.order.orderStatus === "CANCELLED"
                                                                    ? "error.light"
                                                                    : data.order.orderStatus === "PLACED"
                                                                        ? "warning.light"
                                                                        : "info.light",
                                                        fontWeight: 600,
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {data.order.orderStatus}
                                                </Typography>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                Payment Method using:
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: "12px",
                                                        color: "white",
                                                        bgcolor:
                                                            data.order.paymentDetails.paymentMethod === "STRIPE"
                                                                ? "info.light" : "warning.light",
                                                        fontWeight: 600,
                                                        display: "inline-block",
                                                    }}
                                                > {data.order.paymentDetails.paymentMethod}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="left">{data.order.totalSellingPrice}</TableCell>
                                </TableRow>
                            </TableBody>
                        )) :
                        (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                            Your transactions list is empty. Once someone places orders and after successful payment they
                                            will be shown here.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                </Table>
            </TableContainer>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </>
    );
}
