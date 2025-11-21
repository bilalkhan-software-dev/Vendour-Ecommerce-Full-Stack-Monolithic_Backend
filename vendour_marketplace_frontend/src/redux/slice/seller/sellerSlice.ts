import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SellerResponse } from "../../../types/seller";
import { api } from "../../../config/api";
import { SELLER_PROFILE_ENDPOINT, SELLER_REPORT_ENDPOINT } from "../../../config/apiEndpoints";
import type { AxiosError } from "axios";
import type { SellerReportResponse } from "../../../types/sellerReport";

export const fetchSellerProfile = createAsyncThunk<
    SellerResponse,
    void,
    { rejectValue: string }
>(
    "/seller/fetchSellerProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_PROFILE_ENDPOINT);
            console.log("seller: ",response.data.data);
            

            return response.data.data as SellerResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller Profile. Please try again.");
        }
    }
);






export const fetchSellerReport = createAsyncThunk<
    SellerReportResponse,
    void,
    { rejectValue: string }
>(
    "/seller/fetchSellerReport",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_REPORT_ENDPOINT);
            console.log("Seller report: ", response.data.data);
            return response.data.data as SellerReportResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller report. Please try again.");
        }
    }
);











interface SellerState {
    profile: SellerResponse | null;
    report: SellerReportResponse | null;
    loading: boolean;
    error: string | null;
}


const initialState: SellerState = {
    profile: null,
    loading: false,
    report: null,
    error: null,
};


const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(fetchSellerProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerProfile.fulfilled, (state, action: PayloadAction<SellerResponse>) => {
            state.loading = false;
            state.profile = action.payload;
        }
        );
        builder.addCase(fetchSellerProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });
        
    

        builder.addCase(fetchSellerReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerReport.fulfilled, (state, action: PayloadAction<SellerReportResponse>) => {
            state.loading = false;
            state.report = action.payload;
        }
        );
        builder.addCase(fetchSellerReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });






    },
});

export default sellerSlice.reducer;
