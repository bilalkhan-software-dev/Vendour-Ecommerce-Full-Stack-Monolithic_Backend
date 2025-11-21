import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
    Avatar,
    Typography,
    Box,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    fetchSellerOrders,
    updateSellerOrderStatus,
} from "../../../redux/slice/seller/sellerOrderSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { PhoneRounded } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        verticalAlign: "top",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const ORDER_STATUSES = [
    // { value: "", name: "Placed" },
    // { value: "", name: "Confirmed" },
    { value: "PACKED", name: "Packed" },
    { value: "SHIPPED", name: "Shipped" },
    { value: "OUT_FOR_DELIVERY", name: "Out For Delivery" },
    { value: "DELIVERED", name: "Delivered" },
    // { value: "", name: "Cancelled" },
    { value: "RETURNED", name: "Returned" },
];

export default function OrderTable() {
    const sellerOrder = useAppSelector((store) => store.sellerOrder);
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchOrders = async () => {
            const result = await dispatch(fetchSellerOrders());
            if (fetchSellerOrders.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message:
                        result.payload ||
                        "Unable to fetch orders. Please try again later.",
                    severity: "error",
                });
            }
        };
        fetchOrders();
    }, [dispatch]);

    const handleUpdateOrderStatus = async (orderId: number, orderStatus: string) => {
        const result = await dispatch(updateSellerOrderStatus({ orderId, orderStatus }));

        if (updateSellerOrderStatus.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Order status updated successfully.",
                severity: "success",
            });
        } else if (updateSellerOrderStatus.rejected.match(result)) {
            setSnackbar({
                open: true,
                message:
                    result.payload ||
                    "Unable to update order status. Please try again later.",
                severity: "error",
            });
        }
    };

    if (sellerOrder.loading) {
        return (
            <div className="w-full h-[60vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table sx={{ minWidth: 1000 }} aria-label="seller order table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Order Id</StyledTableCell>
                            <StyledTableCell align="center">Products</StyledTableCell>
                            <StyledTableCell align="center">Customer & Address</StyledTableCell>
                            <StyledTableCell align="center">Order Status</StyledTableCell>
                            <StyledTableCell align="center">Payment Status</StyledTableCell>
                            <StyledTableCell align="center">Update</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {sellerOrder.orders && sellerOrder.orders.length > 0 ? (
                        <TableBody>
                            {sellerOrder.orders.map((order) => (
                                <StyledTableRow key={order.id} className="hover:bg-gray-100">
                                    {/* Order ID */}
                                    <StyledTableCell>
                                        <Typography fontWeight={600}>{order.orderId}</Typography>
                                    </StyledTableCell>

                                    {/* Products */}
                                    <StyledTableCell align="center">
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            {order.orderItems.map((item) => (
                                                <>
                                                    <Box
                                                        key={item.orderItemId}
                                                        display="flex"
                                                        alignItems="center"
                                                        gap={1}
                                                    >
                                                        <Avatar
                                                            src={item.product?.images[0] || ""}
                                                            variant="rounded"
                                                            sx={{ width: 40, height: 40 }}
                                                        />
                                                        <Typography fontSize="0.9rem">
                                                            {item.product?.title}
                                                        </Typography>
                                                    </Box>
                                                    <h1 className="font-semibold">Qty: {item.quantity}</h1>
                                                    <h1 className="font-semibold">Total: {item.sellingPrice}</h1>
                                                </>
                                            ))}
                                        </Box>
                                    </StyledTableCell>

                                    {/* Address, Name, Mobile */}
                                    <StyledTableCell align="center">
                                        <Box display="flex" flexDirection="column" textAlign="left" gap={0.5}>
                                            <Typography fontWeight={600}>
                                                {order.user?.fullName || "Unknown"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <PhoneRounded color="success" fontSize="small" /> {order.address?.mobile || "-"}
                                            </Typography>
                                            <Typography variant="body2">{order.address?.address}</Typography>
                                            <Typography variant="body2">
                                                {order.address?.locality}, {order.address?.city}
                                            </Typography>
                                            <Typography variant="body2">{order.address?.state}</Typography>
                                        </Box>
                                    </StyledTableCell>

                                    {/* Current Status */}
                                    <StyledTableCell align="center">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: "12px",
                                                color: "white",
                                                bgcolor:
                                                    order.orderStatus === "DELIVERED"
                                                        ? "success.light"
                                                        : order.orderStatus === "CANCELLED"
                                                            ? "error.light"
                                                            : order.orderStatus === "PLACED"
                                                                ? "warning.light"
                                                                : "info.light",
                                                fontWeight: 600,
                                                display: "inline-block",
                                            }}
                                        >
                                            {order.orderStatus}
                                        </Typography>
                                    </StyledTableCell>

                                    {/* Payment status */}
                                    <StyledTableCell align="center">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: "12px",
                                                color: "white",
                                                bgcolor:
                                                    order.paymentStatus === "COMPLETED"
                                                        ? "success.light"
                                                        : order.paymentStatus === "FAILED"
                                                            ? "error.light"
                                                            : order.paymentStatus === "PENDING"
                                                                ? "warning.light"
                                                                : "info.light",
                                                fontWeight: 600,
                                                display: "inline-block",
                                            }}
                                        >
                                            {order.paymentStatus}
                                        </Typography>
                                    </StyledTableCell>


                                    {/* Update Status with Select */}
                                    <StyledTableCell align="center">
                                        <Select
                                            size="small"
                                            value={order.orderStatus}
                                            disabled={["CANCELLED", "PENDING"].includes(order.orderStatus)}
                                            onChange={(e) =>
                                                handleUpdateOrderStatus(order.id, e.target.value)
                                            }
                                            sx={{ minWidth: 160 }}
                                        >
                                            {ORDER_STATUSES.map((status) => (
                                                <MenuItem key={status.name} value={status.value}>
                                                    {status.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                        Your order list is empty. Once someone places orders, they
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
            />;
        </>
    );
}
