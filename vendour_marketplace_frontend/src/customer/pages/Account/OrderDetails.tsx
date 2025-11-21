import { Alert, AlertTitle, Backdrop, Box, Button, CircularProgress, Divider, Fade, Modal, Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import { ErrorRounded, HomeRounded, LocationOnRounded, PaymentRounded, PhoneRounded } from "@mui/icons-material";
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
                <section className="light-thin-border rounded-md shadow-sm bg-white">
                    <div className="flex justify-between items-start p-5 text-sm">
                        <div>
                            <p className="font-semibold">Total Item Price</p>
                            <p className="text-gray-900 italic text-[13px] mt-1">
                                You Saved  <span className="font-semibold">
                                    {order.currentOrder?.discount ?? "10%"}% </span> on
                                this item
                            </p>
                        </div>
                        <p className="font-bold text-lg">
                            Rs. {order.currentOrder?.totalSellingPrice ?? 0}
                        </p> <p className=" text-lg line-through">
                            Rs. {order.currentOrder?.totalMrpPrice ?? 0}
                        </p>
                    </div>

                    <Divider />
                    <div className={`px-5 py-3 text-xs flex items-center ${order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                        ? "bg-orange-50 text-orange-800"
                        : "bg-blue-50 text-blue-800"
                        }`}>
                        <PaymentRounded fontSize="small" />
                        <span className="ml-2 font-medium">
                            {order.currentOrder?.paymentDetails.paymentMethod === "JAZZCASH"
                                ? "Paid using JazzCash"
                                : "Paid using Stripe"}
                        </span>
                    </div>
                    <Divider />

                    <div className="px-5 py-3 text-xs">
                        <strong>Sold By:</strong>{" "}
                        {order.currentOrderItem?.product.seller?.businessName ??
                            "Unknown Seller"}
                    </div>

                    <div className="px-5 pb-5">

                        <Button
                            color="error"
                            variant="outlined"
                            fullWidth
                            onClick={() => handleCancelOrder(order.currentOrder?.id ?? 0)}
                            disabled={
                                ["DELIVERED", "SHIPPED", "OUT_FOR_DELIVERY", "CANCELLED"].includes(
                                    order?.currentOrder?.orderStatus ?? ""
                                )
                            }
                            sx={{ py: "0.75rem", borderRadius: "10px" }}
                        >
                            {order.currentOrder?.orderStatus.includes("CANCELLED") ? "Order Cancelled" : "Cancel Order"}
                        </Button>
                    </div>
                </section>
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