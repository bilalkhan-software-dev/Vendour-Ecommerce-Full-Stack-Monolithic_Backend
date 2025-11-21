import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DealRequest, DealResponse, DealSliceState } from "../../../types/deal";
import { AxiosError } from "axios";
import {
    ALL_DEALS_ENDPOINT,
    CREATE_DEAL_ENDPOINT,
    DELETE_DEAL_ENDPOINT,
    UPDATE_DEAL_ENDPOINT,
} from "../../../config/apiEndpoints";
import { api } from "../../../config/api";

export const createDeal = createAsyncThunk<
    DealResponse,
    { dealRequest: DealRequest },
    { rejectValue: string }
>("/deal/createDeal", async ({ dealRequest }, { rejectWithValue }) => {
    try {
        const response = await api.post(CREATE_DEAL_ENDPOINT, dealRequest);
        return response.data.data as DealResponse;
    } catch (err) {
        console.log("Error: ", err);
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to create deal. Please try again.");
    }
});

export const updateDeal = createAsyncThunk<
    DealResponse,
    { dealId: number; dealRequest: DealRequest },
    { rejectValue: string }
>("/deal/updateDeal", async ({ dealId, dealRequest }, { rejectWithValue }) => {
    try {
        const response = await api.patch(
            UPDATE_DEAL_ENDPOINT.replace(":dealId", dealId.toString()),
            dealRequest
        );
        return response.data.data as DealResponse;
    } catch (err) {
        console.log("Error: ", err);
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to update deal. Please try again.");
    }
});

export const getAllDeals = createAsyncThunk<
    DealResponse[],
    void,
    { rejectValue: string }
>("/deal/getAllDeals", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(ALL_DEALS_ENDPOINT);
        return response.data.data as DealResponse[];
    } catch (err) {
        console.log("Error: ", err);
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to fetch deals. Please try again.");
    }
});

export const deleteDeal = createAsyncThunk<
    string,
    { dealId: number },
    { rejectValue: string }
>("/deal/deleteDeal", async ({ dealId }, { rejectWithValue }) => {
    try {
        const response = await api.delete(DELETE_DEAL_ENDPOINT.replace(":dealId", dealId.toString()));
        return response.data.message as string;
    } catch (err) {
        console.log("Error: ", err);
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to delete deal. Please try again.");
    }
});

const initialState: DealSliceState = {
    loading: false,
    deal: null,
    deals: [],
    error: null,
};

const dealSlice = createSlice({
    name: "deal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createDeal.fulfilled, (state, action) => {
            state.loading = false;
            state.deal = action.payload;
            state.deals.push(action.payload);
        });
        builder.addCase(createDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(updateDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateDeal.fulfilled, (state, action) => {
            state.loading = false;
            state.deal = action.payload;
            state.deals = state.deals.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
        });
        builder.addCase(updateDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(getAllDeals.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllDeals.fulfilled, (state, action) => {
            state.loading = false;
            state.deals = action.payload;
        });
        builder.addCase(getAllDeals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(deleteDeal.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteDeal.fulfilled, (state, action) => {
            state.loading = false;
            state.deals = state.deals.filter((deal) => deal.id !== Number(action.meta.arg.dealId));
        });
        builder.addCase(deleteDeal.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default dealSlice.reducer;
