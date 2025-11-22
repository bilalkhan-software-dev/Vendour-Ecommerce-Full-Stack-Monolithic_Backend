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
    Chip,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    fetchSellerOrders,
    updateSellerOrderStatus,
} from "../../../redux/slice/seller/sellerOrderSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { PhoneRounded, LocalOfferRounded, InfoRounded } from "@mui/icons-material";

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
    { value: "PACKED", name: "Packed" },
    { value: "SHIPPED", name: "Shipped" },
    { value: "OUT_FOR_DELIVERY", name: "Out For Delivery" },
    { value: "DELIVERED", name: "Delivered" },
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

    // Calculate pricing breakdown for an order item
    const calculatePricingBreakdown = (item: any) => {
        const mrpPrice = item.mrpPrice || 0;
        const originalSellingPrice = item.originalSellingPrice || 0;
        const sellingPrice = item.sellingPrice || 0;
        const couponDiscountAmount = item.couponDiscountAmount || 0;
        
        // Your discount (MRP - Your original selling price)
        const yourDiscount = mrpPrice - originalSellingPrice;
        // Admin coupon discount (Your selling price - Final selling price)
        const adminCouponDiscount = originalSellingPrice - sellingPrice;
        
        return {
            mrpPrice,
            originalSellingPrice,
            sellingPrice,
            couponDiscountAmount,
            yourDiscount,
            adminCouponDiscount,
            yourEarnings: sellingPrice // What you actually get
        };
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
                <Table sx={{ minWidth: 1200 }} aria-label="seller order table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Order Id</StyledTableCell>
                            <StyledTableCell align="center">Products & Pricing</StyledTableCell>
                            <StyledTableCell align="center">Customer & Address</StyledTableCell>
                            <StyledTableCell align="center">Order Status</StyledTableCell>
                            <StyledTableCell align="center">Payment Status</StyledTableCell>
                            <StyledTableCell align="center">Update Status</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {sellerOrder.orders && sellerOrder.orders.length > 0 ? (
                        <TableBody>
                            {sellerOrder.orders.map((order) => (
                                <StyledTableRow key={order.id} className="hover:bg-gray-100">
                                    {/* Order ID */}
                                    <StyledTableCell>
                                        <Typography fontWeight={600}>{order.orderId}</Typography>
                                        {order.couponCode && (
                                            <Chip
                                                icon={<LocalOfferRounded />}
                                                label={`Coupon: ${order.couponCode}`}
                                                color="success"
                                                size="small"
                                                sx={{ mt: 0.5, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </StyledTableCell>

                                    {/* Products with Detailed Pricing */}
                                    <StyledTableCell align="center">
                                        <Box display="flex" flexDirection="column" gap={2}>
                                            {order.orderItems.map((item) => {
                                                const pricing = calculatePricingBreakdown(item);
                                                return (
                                                    <Box
                                                        key={item.orderItemId}
                                                        sx={{ 
                                                            p: 1.5, 
                                                            border: '1px solid', 
                                                            borderColor: 'divider', 
                                                            borderRadius: 1,
                                                            backgroundColor: 'background.paper'
                                                        }}
                                                    >
                                                        {/* Product Info */}
                                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                            <Avatar
                                                                src={item.product?.images[0] || ""}
                                                                variant="rounded"
                                                                sx={{ width: 40, height: 40 }}
                                                            />
                                                            <Box flex={1}>
                                                                <Typography fontSize="0.9rem" fontWeight={500}>
                                                                    {item.product?.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Qty: {item.quantity}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Pricing Breakdown */}
                                                        <Box sx={{ textAlign: 'left', fontSize: '0.8rem' }}>
                                                            {/* MRP */}
                                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    MRP:
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                                                    Rs. {pricing.mrpPrice}
                                                                </Typography>
                                                            </Box>

                                                            {/* Your Price */}
                                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <Typography variant="caption" fontWeight={500}>
                                                                        Your Price:
                                                                    </Typography>
                                                                    <Tooltip title="Your set selling price before any coupons">
                                                                        <InfoRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                                    </Tooltip>
                                                                </Box>
                                                                <Typography variant="caption" fontWeight={500}>
                                                                    Rs. {pricing.originalSellingPrice}
                                                                </Typography>
                                                            </Box>

                                                            {/* Your Discount */}
                                                            {pricing.yourDiscount > 0 && (
                                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                    <Typography variant="caption" color="success.main">
                                                                        Your Discount:
                                                                    </Typography>
                                                                    <Typography variant="caption" color="success.main" fontWeight={500}>
                                                                        -Rs. {pricing.yourDiscount.toFixed(2)}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Admin Coupon Discount */}
                                                            {pricing.adminCouponDiscount > 0 && (
                                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                                        <Typography variant="caption" color="warning.main">
                                                                            Admin Coupon Discount:
                                                                        </Typography>
                                                                        <Tooltip title="Discount applied by admin coupon (doesn't affect your earnings)">
                                                                            <InfoRounded sx={{ fontSize: 12, color: 'warning.main' }} />
                                                                        </Tooltip>
                                                                    </Box>
                                                                    <Typography variant="caption" color="warning.main" fontWeight={500}>
                                                                        -Rs. {pricing.adminCouponDiscount.toFixed(2)}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Final Price & Your Earnings */}
                                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                                <Typography variant="caption" fontWeight={600}>
                                                                    Customer Paid:
                                                                </Typography>
                                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                                    Rs. {pricing.sellingPrice}
                                                                </Typography>
                                                            </Box>

                                                            {/* Your Actual Earnings */}
                                                            <Box display="flex" justifyContent="space-between" mt={1} pt={1} sx={{ borderTop: '1px dashed', borderColor: 'divider' }}>
                                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                                    Your Earnings:
                                                                </Typography>
                                                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                                                    Rs. {pricing.sellingPrice}
                                                                </Typography>
                                                            </Box>

                                                            {/* Summary */}
                                                            <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 0.5 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Total Discount: Rs. {(pricing.yourDiscount + pricing.adminCouponDiscount).toFixed(2)}
                                                                </Typography>
                                                                <br />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ({Math.round((pricing.yourDiscount / pricing.mrpPrice) * 100)}% your discount + {Math.round((pricing.adminCouponDiscount / pricing.mrpPrice) * 100)}% coupon)
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
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
                                <TableCell colSpan={6} align="center">
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
            />
        </>
    );
}