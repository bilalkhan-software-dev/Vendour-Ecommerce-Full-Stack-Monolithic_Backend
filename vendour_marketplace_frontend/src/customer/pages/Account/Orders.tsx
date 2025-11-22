import { useEffect, useState } from "react";
import store, { useAppDispatch, useAppSelector } from "../../../redux/store";
import OrderItem from "./OrderItem";
import { userOrders } from "../../../redux/slice/customer/orderSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { ShoppingCartRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";


const Orders = () => {


    const dispatch = useAppDispatch();
    const { order } = useAppSelector(store => store);
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {

        const fetchOrders = async () => {
            const result = await dispatch(userOrders())
            if (userOrders.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Your order retrieved successfully.",
                    severity: "success",
                });
            } else if (userOrders.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Unable to fetch user orders. Please try again later!",
                    severity: "error",
                });
            }
        }

        fetchOrders();
    }, [dispatch])




    if (order.loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }



    return (
        <>
            <div className="text-sm max-h-screen overflow-y-auto hide-scrollbar mb-10">
                <div className="pb-5">
                    <h1 className="font-semibold">
                        All Orders
                    </h1>
                    <p>from anytime</p>
                </div>
                <div className="space-y-2">
                    {order.orders && order.orders?.length > 0 ? (
                        order.orders.map((data, index) => (
                            <div key={index} className="light-thin-border rounded-md p-4 overflow-auto">
                                {data.orderItems.map((item, i) => (
                                    <div key={i} onClick={() => navigate(`/account/order/${data.id}/${item.orderItemId}`)}>
                                        <OrderItem
                                            item={item}
                                            couponCode={data.couponCode}
                                            orderStatus={data.orderStatus ?? "PLACED"}
                                            deliverDate={data.deliveryDate}
                                        />

                                    </div>

                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 light-thin-border rounded-md bg-gray-50">
                            <ShoppingCartRounded sx={{ fontSize: 50, color: "gray" }} />
                            <p className="text-sm font-medium mt-2">No orders found</p>
                            <p className="text-xs italic opacity-70">
                                Once you place an order, it will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default Orders;