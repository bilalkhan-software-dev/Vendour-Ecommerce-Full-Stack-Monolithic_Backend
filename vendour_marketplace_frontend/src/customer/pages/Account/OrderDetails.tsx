import { Alert, AlertTitle, Backdrop, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Fade, Grid, Modal, Tooltip, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import { ErrorRounded, HomeRounded, LocationOnRounded, PaymentRounded, PhoneRounded, StoreRounded } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useEffect, useState } from "react";
import { cancelOrder, userOrderDetailById, userOrderDetailOrderItemId } from "../../../redux/slice/customer/orderSlice";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import type { SnackbarProps } from "../../../types/props";
import { placeHolderImage } from "../../../data/account/customerAccount";
import AddReview from "../Review/AddReview";
import BackToPreviousPage from "../../component/BackToPreviousPage/BackToPreviousPage";

const OrderDetails = () => {


    const navigate = useNavigate();
    const { orderId, orderItemId } = useParams();

    const dispatch = useAppDispatch();
    const { order, auth } = useAppSelector(store => store);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success"
    })
    const [open, setOpen] = useState(false);


    useEffect(() => {

        if (auth.user) {
            const fetchOrderDetail = async () => {
                const result = await dispatch(userOrderDetailById({ orderId: Number(orderId) }));
                if (userOrderDetailById.rejected.match(result)) {
                    setSnackbar({
                        open: true,
                        message: result.payload || "Unable to fetch order detail. Please try again later",
                        severity: "error"
                    })
                    setTimeout(() => {
                        navigate("/account/orders")
                    }, 6000);
                }
            }

            const fetchOrderItemDetail = async () => {
                const result = await dispatch(userOrderDetailOrderItemId({ orderId: Number(orderItemId) }));
                if (userOrderDetailOrderItemId.rejected.match(result)) {
                    setSnackbar({
                        open: true,
                        message: result.payload || "Unable to fetch order item detail. Please try again later",
                        severity: "error"
                    })
                }
            }

            fetchOrderDetail();
            fetchOrderItemDetail();
        }
    }, [auth.user, dispatch, navigate, orderId, orderItemId])


    const handleCancelOrder = async (id: number) => {
        const result = await dispatch(cancelOrder({ orderId: id }));
        if (cancelOrder.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Your order cancelled successfully",
                severity: "success"
            })
        } else if (cancelOrder.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to cancel detail. Please try again later",
                severity: "error"
            })
        }
    }




    const address = order.currentOrder?.address;



    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    if (order.loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }
    if (!auth.user) {
        return (
            <div className="flex justify-center items-center min-h-[200px] overflow-auto  md:mb-65">
                <Alert severity="warning" variant="outlined" sx={{ maxWidth: 500 }}>
                    <AlertTitle>Login Required</AlertTitle>
                    You must have to login to see order details
                </Alert>
            </div>
        );
    }

    return (
        <>
            <Box className='space-y-5 max-h-screen overflow-y-auto mb-20 hide-scrollbar'>
                <BackToPreviousPage />
                <section className="flex flex-col gap-5 justify-center items-center mb-10 shadow-lg">
                    {
                        order.currentOrderItem?.product.images && order.currentOrderItem.product.images.length > 0 ?
                            <img src={order.currentOrderItem?.product.images[0]}
                                alt={""}
                                className="w-[200px] md:w-[300px] rounded-lg object-cover" />
                            :
                            <img src={placeHolderImage}
                                alt={""}
                                className="w-[200px] md:w-[300px] rounded-lg object-cover" />
                    }

                    <div className="text-sm space-y-1 text-center">
                        <h1 className="font-bold">{order.currentOrderItem?.product.title ?? "For product title"}</h1>
                        <p>{order.currentOrderItem?.product.description ?? "For product description"}</p>
                        <p><strong>Size: </strong>{order.currentOrderItem?.product.sizes ?? "For product size"}</p>
                    </div>

                    <div className="pb-4">
                        <Tooltip
                            title={
                                ["CONFIRMED", "DELIVERED"].includes(order.currentOrder?.orderStatus ?? "")
                                    ? "You can now write a review for this product."
                                    : "Reviews can only be submitted after your order is confirmed or delivered."
                            }
                        >
                            <span>
                                <Button
                                    variant="outlined"
                                    disabled={
                                        !["CONFIRMED", "DELIVERED"].includes(order.currentOrder?.orderStatus ?? "")
                                    }
                                    onClick={handleOpenModal}
                                >
                                    Write review
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                </section>

                {/* Order step like pending,processing or completed */}
                <section className="light-thin-border p-5 rounded-md">
                    <OrderStepper
                        orderStatus={order.currentOrder?.orderStatus ?? ""}
                        orderDate={order.currentOrder?.orderDate ?? ""}
                    />
                </section>

                {/* Delivery addresss */}
                <div className="light-thin-border rounded-md space-y-4 px-5">
                    <div className="space-y-2 pt-5 pb-5">
                        <h1 className="font-bold pb-3">Delivery Address</h1>
                        <div className="flex gap-3">
                            <h1 className="font-semibold flex text-[12px] md:text-[15px] items-center gap-2 text-gray-800">
                                <HomeRounded fontSize="small" className="text-primary-color" />
                                {address?.name}
                            </h1>
                            <Divider flexItem orientation="vertical" />
                            <p className="flex items-center gap-2 text-[12px] md:text-[15px] text-gray-700">
                                <PhoneRounded fontSize="small" className="text-green-500" />
                                {address?.mobile}
                            </p>
                        </div>
                        <p className="flex items-center gap-2 text-[12px] md:text-[15px] text-wrap text-gray-700">
                            <LocationOnRounded fontSize="small" className="text-red-500" />
                            {`${address?.address}, ${address?.locality}, ${address?.city}, ${address?.state}, ${address?.pinCode}`}
                        </p>
                    </div>
                </div>

                {/* Price & Payment */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-0">
                        {/* Without Coupon */}
                        {!order.currentOrder?.couponCode && (
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Total Item Price</h3>
                                        <p className="text-green-600 italic text-sm flex items-center gap-1">
                                            You saved
                                            <span className="font-bold text-green-600">
                                                Rs. {((order.currentOrderItem?.mrpPrice || 0) - (order.currentOrderItem?.sellingPrice || 0)).toFixed(2)}
                                            </span>
                                            on this item
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-blue-600">
                                            Rs. {order.currentOrderItem?.sellingPrice || 0}
                                        </p>
                                        <p className="text-gray-500 line-through text-sm">
                                            Rs. {order.currentOrderItem?.mrpPrice || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* With Coupon */}
                        {order.currentOrder?.couponCode && (
                            <div className="p-6">
                                {/* Coupon Header */}
                                <div className="text-center mb-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 mb-2">
                                        Coupon Applied: {order.currentOrder.couponCode}
                                    </span>
                                    <p className="text-green-600 font-medium text-sm">
                                        You saved Rs. {order.currentOrderItem?.couponDiscountAmount || 0} with this coupon!
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Price Breakdown */}
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3">Price Breakdown</h4>

                                        {/* Original MRP */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm">Original MRP:</span>
                                            <span className="text-gray-600 text-sm">Rs. {order.currentOrderItem?.mrpPrice || 0}</span>
                                        </div>

                                        {/* Original Selling Price */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm">Original Selling Price:</span>
                                            <span className="text-gray-600 text-sm">Rs. {order.currentOrderItem?.originalSellingPrice || 0}</span>
                                        </div>

                                        {/* Coupon Discount */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-green-600 text-sm">Coupon Discount ({order.currentOrder.couponCode}):</span>
                                            <span className="text-green-600 font-bold text-sm">- Rs. {order.currentOrderItem?.couponDiscountAmount || 0}</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-300 my-3"></div>

                                        {/* Final Price */}
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900">Final Amount Paid:</span>
                                            <span className="text-xl font-bold text-blue-600">Rs. {order.currentOrderItem?.sellingPrice || 0}</span>
                                        </div>
                                    </div>

                                    {/* Savings Summary */}
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h4 className="text-sm font-bold text-green-800 mb-3">Your Savings Summary</h4>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-gray-600 text-sm">Saved from MRP:</div>
                                            <div className="text-right text-green-600 font-bold text-sm">
                                                Rs. {((order.currentOrderItem?.mrpPrice || 0) - (order.currentOrderItem?.sellingPrice || 0)).toFixed(2)}
                                            </div>

                                            <div className="text-gray-600 text-sm">From Coupon:</div>
                                            <div className="text-right text-green-600 font-bold text-sm">
                                                Rs. {order.currentOrderItem?.couponDiscountAmount || 0}
                                            </div>

                                            <div className="text-gray-600 text-sm">Regular Discount:</div>
                                            <div className="text-right text-green-600 font-bold text-sm">
                                                Rs. {((order.currentOrderItem?.mrpPrice || 0) - (order.currentOrderItem?.originalSellingPrice || 0)).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Discount Representation */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="text-sm font-bold text-blue-800 mb-3">Discount Breakdown</h4>

                                        {/* Price progression */}
                                        <div className="space-y-2 mb-4">
                                            {/* MRP Line */}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 text-xs">MRP: Rs. {order.currentOrderItem?.mrpPrice || 0}</span>
                                            </div>

                                            {/* Regular Discount Line */}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 text-xs">Regular Price: Rs. {order.currentOrderItem?.originalSellingPrice || 0}</span>
                                                <span className="text-green-600 text-xs">
                                                    -Rs. {((order.currentOrderItem?.mrpPrice || 0) - (order.currentOrderItem?.originalSellingPrice || 0)).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Coupon Discount Line */}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 text-xs">After Coupon: Rs. {order.currentOrderItem?.sellingPrice || 0}</span>
                                                <span className="text-green-600 text-xs">
                                                    -Rs. {order.currentOrderItem?.couponDiscountAmount || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total Savings */}
                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-600 font-bold text-sm">Total Savings:</span>
                                                <span className="text-lg font-bold text-green-600">
                                                    Rs. {((order.currentOrderItem?.mrpPrice || 0) - (order.currentOrderItem?.sellingPrice || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200"></div>

                        {/* Payment Method */}
                        <div className={`p-4 flex items-center ${order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                            ? "bg-orange-50 border-l-4 border-orange-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                            }`}>
                            <PaymentRounded
                                fontSize="small"
                                className={
                                    order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                                        ? "text-orange-600 mr-2"
                                        : "text-blue-600 mr-2"
                                }
                            />
                            <span className={`text-sm font-medium ${order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                                ? "text-orange-800"
                                : "text-blue-800"
                                }`}>
                                {order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                                    ? "Paid using JazzCash"
                                    : "Paid using Stripe"}
                            </span>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Seller Info */}
                        <div className="p-4 flex items-center bg-gray-50">
                            <StoreRounded fontSize="small" className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">
                                <strong>Sold By:</strong>{' '}
                                {order.currentOrderItem?.product.seller?.businessName ?? "Unknown Seller"}
                            </span>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Cancel Order Button */}
                        <div className="p-4">
                            <button
                                onClick={() => handleCancelOrder(order.currentOrder?.id ?? 0)}
                                disabled={
                                    ["DELIVERED", "SHIPPED", "OUT_FOR_DELIVERY", "CANCELLED"].includes(
                                        order?.currentOrder?.orderStatus ?? ""
                                    ) || order.currentOrder?.couponCode != null
                                }
                                className={`
          w-full py-3 px-4 rounded-lg border-2 font-bold text-base transition-all duration-200
          ${["DELIVERED", "SHIPPED", "OUT_FOR_DELIVERY", "CANCELLED"].includes(
                                    order?.currentOrder?.orderStatus ?? ""
                                ) || order.currentOrder?.couponCode
                                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "border-red-500 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                                    }
        `}
                            >
                                {order.currentOrder?.orderStatus?.includes("CANCELLED")
                                    ? "Order Cancelled"
                                    : "Cancel Order"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
            <SnackbarMessage
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
            <Modal
                aria-labelledby="add-address-modal"
                aria-describedby="form-to-add-new-address"
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: "5%", sm: "50%" },
                            left: "50%",
                            transform: { xs: "translateX(-50%)", sm: "translate(-50%, -50%)" },
                            width: { xs: "90%", sm: 500 },
                            bgcolor: "background.paper",
                            borderRadius: "8px",
                            boxShadow: 24,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            p: 4,
                        }}
                        className="hide-scrollbar"
                    >

                        {order.currentOrderItem?.product.id &&
                            <AddReview onClose={handleCloseModal} productId={order.currentOrderItem?.product.id ?? 1} />
                        }

                        {!order.currentOrderItem?.product.id &&
                            <Alert icon={<ErrorRounded fontSize="inherit" />} severity="error">
                                Something went wrong with product ID, that’s why the add review modal is not showing.
                                Refresh the page or try again later.
                            </Alert>
                        }
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default OrderDetails;