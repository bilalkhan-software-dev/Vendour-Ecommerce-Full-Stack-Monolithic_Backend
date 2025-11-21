import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SELLER_ORDERS_ENDPOINT, SELLER_TRANSACTIONS_ENDPOINT, SELLER_UPDATE_ORDER_STATUS_ENDPOINT } from "../../../config/apiEndpoints";
import type { OrderResponse, SellerOrderSliceState, TransactionResponse } from "../../../types/order";
import type { AxiosError } from "axios";
import { api } from "../../../config/api";



export const fetchSellerOrders = createAsyncThunk<
    OrderResponse[],
    void,
    { rejectValue: string }
>(
    "/sellerOrder/fetchSellerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_ORDERS_ENDPOINT);
            console.log("Seller orders: ", response.data.data)
            return response.data.data as OrderResponse[];
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch seller orders. Please try again.");
        }
    }
);

export const fetchSellerTransactions = createAsyncThunk<
    TransactionResponse[],
    void,
    { rejectValue: string }
>(
    "/sellerOrder/fetchSellerTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_TRANSACTIONS_ENDPOINT);
            console.log("Seller transaction: ", response.data.data)
            return response.data.data as TransactionResponse[];
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch seller orders. Please try again.");
        }
    }
);

export const updateSellerOrderStatus = createAsyncThunk<
    OrderResponse,
    { orderId: number, orderStatus: string },
    { rejectValue: string }
>(
    "/sellerOrder/updateSellerOrderStatus",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${SELLER_UPDATE_ORDER_STATUS_ENDPOINT}/${payload.orderId}/update/status/${payload.orderStatus}`);
            console.log("Updated seller order: ", response.data.data)
            return response.data.data as OrderResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to update seller orders status. Please try again.");
        }
    }
);


const initialState: SellerOrderSliceState = {
    loading: false,
    orders: [],
    transactions: [],
    order: null,
    error: null,
    message: null
};

const sellerOrderSlice = createSlice({
    name: "sellerOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(fetchSellerOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(fetchSellerOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchSellerOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to Fetch seller orders. Please try again.";
        });

        builder.addCase(fetchSellerTransactions.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(fetchSellerTransactions.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        });
        builder.addCase(fetchSellerTransactions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to Fetch seller transactions. Please try again.";
        });

        builder.addCase(updateSellerOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(updateSellerOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;

            if (state.orders && state.orders.length > 0) {
                state.orders = state.orders?.map(order =>
                    order.id === action.payload.id ? action.payload : order
                );
            }
            state.message = "Order status updated successfully";
        });
        builder.addCase(updateSellerOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update seller order status. Please try again.";
        });
    }
});


export default sellerOrderSlice.reducer;

