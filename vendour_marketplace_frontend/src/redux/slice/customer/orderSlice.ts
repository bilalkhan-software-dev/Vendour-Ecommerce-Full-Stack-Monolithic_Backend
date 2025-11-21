import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { OrderItemResponse, OrderResponse, OrderSliceState, StripePaymentResponse } from "../../../types/order";
import type { Address } from "../../../types/seller";
import { api } from "../../../config/api";
import type { AxiosError } from "axios";
import { GET_ORDER_DETAIL_BY_ORDER_ID_ENDPOINT, GET_ORDER_ITEM_DETAIL_BY_ORDERITEM_ID_ENDPOINT, USER_ORDER_CANCEL_ENDPOINT, USER_ORDER_PLACE_JAZZCASH_ENDPOINT, USER_ORDER_PLACE_STRIPE_ENDPOINT, USER_ORDERS_ENDPOINT } from "../../../config/apiEndpoints";



export const placeOrderStripe = createAsyncThunk<
    StripePaymentResponse,
    { addressRequest: Address, paymentMethod: string },
    { rejectValue: string }
>(
    "/order/placeOrderStripe",
    async ({ addressRequest, paymentMethod }, { rejectWithValue }) => {

        try {
            const response = await api.post(`${USER_ORDER_PLACE_STRIPE_ENDPOINT}`, addressRequest, {
                params: {
                    paymentMethod
                },
            });
            console.log("Place order Stripe: ", response.data);

            window.location.href = response.data.data.paymentUrl;
            return response.data.data as StripePaymentResponse;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to place order. Please try again later!");
        }
    }
);
export const placeOrderJazzcash = createAsyncThunk<
    boolean,
    { addressRequest: Address, paymentMethod: string, jazzCashAccountMobileNo: string },
    { rejectValue: string }
>(
    "/order/placeOrderJazzcash",
    async ({ addressRequest, paymentMethod, jazzCashAccountMobileNo }, { rejectWithValue }) => {

        try {
            const response = await api.post(`${USER_ORDER_PLACE_JAZZCASH_ENDPOINT}`, addressRequest, {
                params: {
                    paymentMethod,
                    jazzCashAccountMobileNo
                },
            });
            console.log("Place order Jazzcash: ", response.data);

            return response.data.data as boolean;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Order placement failed.\n" +
                "A possible reason is that you did not provide the OTP to JazzCash. " +
                "When placing an order, you receive an OTP and confirmation request from JazzCash. " +
                "Your order is only confirmed after successful authentication. " +
                "Please try again using this process.",);
        }
    }
);

export const userOrders = createAsyncThunk<
    OrderResponse[],
    void,
    { rejectValue: string }
>(
    "/order/userOrders",
    async (_, { rejectWithValue }) => {

        try {
            const response = await api.get(`${USER_ORDERS_ENDPOINT}`);
            console.log("User orders: ", response.data);

            return response.data.data as OrderResponse[];

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to fetch orders. Please try again later.");
        }
    }
);

export const userOrderDetailById = createAsyncThunk<
    OrderResponse,
    { orderId: number },
    { rejectValue: string }
>(
    "/order/userOrderDetailById",
    async ({ orderId }, { rejectWithValue }) => {

        try {
            const response = await api.get(`${GET_ORDER_DETAIL_BY_ORDER_ID_ENDPOINT}/${orderId}`);
            console.log(`User order details by id: ${orderId} -> `, response.data);

            return response.data.data as OrderResponse;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to fetch order detail. Please try again later.");
        }
    }
);

export const userOrderDetailOrderItemId = createAsyncThunk<
    OrderItemResponse,
    { orderId: number },
    { rejectValue: string }
>(
    "/order/userOrderDetailOrderItemId",
    async ({ orderId }, { rejectWithValue }) => {

        try {
            const response = await api.get(`${GET_ORDER_ITEM_DETAIL_BY_ORDERITEM_ID_ENDPOINT}/${orderId}`);
            console.log(`User order details by item id: ${orderId} -> `, response.data);

            return response.data.data as OrderItemResponse;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to fetch order item detail. Please try again later.");
        }
    }
);

export const cancelOrder = createAsyncThunk<
    OrderResponse,
    { orderId: number },
    { rejectValue: string }
>(
    "/order/cancelOrder",
    async ({ orderId }, { rejectWithValue }) => {

        try {
            const response = await api.put(`${USER_ORDER_CANCEL_ENDPOINT}/${orderId}`);
            console.log(`User cancel order: ${orderId} -> `, response.data);

            return response.data.data as OrderResponse;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to cancel order. Please try again later.");
        }
    }
);

export const paymentVerifySuccessStripe = createAsyncThunk<
    { message: string },
    { session_id: string, order_id: string },
    { rejectValue: string }
>("/order/paymentVerifySuccessStripe",
    async ({ session_id, order_id }, { rejectWithValue }) => {

        try {
            const response = await api.put(`/payments/stripe/success?session_id=${session_id}&order_id=${order_id}`);
            console.log(`User payment success verification: ${session_id} -> `, response.data);

            return response.data.message as { message: string };

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to verify payment success. Please try again later.");
        }
    }
);

export const paymentVerifyCancelStripe = createAsyncThunk<
    string,
    { session_id: string, order_id: string },
    { rejectValue: string }
>(
    "/order/paymentVerifyCancelStripe",
    async ({ session_id, order_id }, { rejectWithValue }) => {

        try {
            const response = await api.put(`/payments/stripe/cancel?session_id=${session_id}&order_id=${order_id}`);
            console.log(`User payment cancel verification: ${session_id} -> `, response.data);

            return response.data.data.message as string;

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Unable to verify payment cancel. Please try again later.");
        }
    }
);




const initialState: OrderSliceState = {
    loading: false,
    error: null,
    message: null,
    orders: [],
    orderItem: [],
    currentOrder: null,
    currentOrderItem: null,
    stripePaymentResponse: null,
    orderCancelled: false,
    jazzCashPaymentVerified: false
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(placeOrderStripe.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(placeOrderStripe.fulfilled, (state, action) => {
            state.loading = false;
            state.stripePaymentResponse = action.payload;
        });
        builder.addCase(placeOrderStripe.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Stripe order failed.";
        });

        builder.addCase(placeOrderJazzcash.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(placeOrderJazzcash.fulfilled, (state, action) => {
            state.loading = false;
            state.jazzCashPaymentVerified = action.payload;
        });
        builder.addCase(placeOrderJazzcash.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "JazzCash order failed.";
        });

        builder.addCase(userOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(userOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(userOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch orders.";
        });

        builder.addCase(userOrderDetailById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(userOrderDetailById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
        });
        builder.addCase(userOrderDetailById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch order details.";
        });

        builder.addCase(userOrderDetailOrderItemId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(userOrderDetailOrderItemId.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrderItem = action.payload;
        });
        builder.addCase(userOrderDetailOrderItemId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Unable to fetch order item details.";
        });

        builder.addCase(cancelOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(cancelOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
            state.orderCancelled = true;
        });
        builder.addCase(cancelOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to cancel order.";
        });


        builder.addCase(paymentVerifySuccessStripe.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(paymentVerifySuccessStripe.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        });
        builder.addCase(paymentVerifySuccessStripe.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to verify payment.";
        });

        builder.addCase(paymentVerifyCancelStripe.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(paymentVerifyCancelStripe.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        });
        builder.addCase(paymentVerifyCancelStripe.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to verify payment.";
        });
    },
});


export default orderSlice.reducer;
