import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { GET_ALL_SELLERS_BY_ACCOUNT_STATUS_ENDPOINT, GET_SELLER_DETAIL_BY_ID_ENDPOINT, SELLER_REPORT_BY_ID_ENDPOINT, UPDATE_SELLER_ACCOUNT_STATUS_ENDPOINT } from "../../../config/apiEndpoints";
import type { SellerResponse } from "../../../types/seller";
import type { AxiosError } from "axios";
import type { SellerReportResponse } from "../../../types/sellerReport";



export const fetchSellerById = createAsyncThunk<
    SellerResponse,
    { sellerId: number },
    { rejectValue: string }
>(
    "/adminSeller/fetchSellerById",
    async ({ sellerId }, { rejectWithValue }) => {
        try {
            const response = await api.get(GET_SELLER_DETAIL_BY_ID_ENDPOINT.replace(":sellerId", sellerId.toString()));
            console.log("Seller dtls: ", response.data.data);
            return response.data.data as SellerResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller report. Please try again.");
        }
    }
);

export const fetchSellersByAccountStatusForAdmin = createAsyncThunk<
    SellerResponse[],
    { accountStatus: string },
    { rejectValue: string }
>(
    "/adminSeller/fetchSellersByAccountStatusForAdmin",
    async ({ accountStatus }, { rejectWithValue }) => {
        try {
            const response = await api.get(GET_ALL_SELLERS_BY_ACCOUNT_STATUS_ENDPOINT.replace(":accountStatus", accountStatus));
            console.log("Sellers by filter: ", response.data.data);
            return response.data.data as SellerResponse[];
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller report. Please try again.");
        }
    }
);


export const fetchSellerReportById = createAsyncThunk<
    SellerReportResponse,
    { sellerId: number },
    { rejectValue: string }
>(
    "/adminSeller/fetchSellerReportById",
    async ({ sellerId }, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_REPORT_BY_ID_ENDPOINT.replace(":sellerId", sellerId.toString()));
            console.log("Seller report by id: ", response.data.data);
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

export const updateSellerAccountStatus = createAsyncThunk<
    SellerResponse,
    { sellerId: number, accountStatus: string },
    { rejectValue: string }
>(
    "/adminSeller/updateSellerAccountStatus",
    async ({ sellerId, accountStatus }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${UPDATE_SELLER_ACCOUNT_STATUS_ENDPOINT.replace(":sellerId", sellerId.toString())}?accountStatus=${accountStatus}`);
            console.log("Seller update status: ", response.data.data);
            return response.data.data as SellerResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller report. Please try again.");
        }
    }
);





interface AdminSellerState {
    selectedSeller: SellerResponse | null;
    updatedSeller: SellerResponse | null;
    report: SellerReportResponse | null;
    sellers: SellerResponse[] | null;
    loading: boolean;
    error: string | null;
}


const initialState: AdminSellerState = {
    selectedSeller: null,
    updatedSeller: null,
    report: null,
    sellers: null,
    loading: false,
    error: null,
};
const adminSellerSlice = createSlice({
    name: "adminSeller",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSellerById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerById.fulfilled, (state, action: PayloadAction<SellerResponse>) => {
            state.loading = false;
            state.selectedSeller = action.payload;
        }
        );
        builder.addCase(fetchSellerById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });

        builder.addCase(fetchSellersByAccountStatusForAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellersByAccountStatusForAdmin.fulfilled, (state, action: PayloadAction<SellerResponse[]>) => {
            state.loading = false;
            state.sellers = action.payload;
        });
        builder.addCase(fetchSellersByAccountStatusForAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });

        builder.addCase(fetchSellerReportById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchSellerReportById.fulfilled, (state, action: PayloadAction<SellerReportResponse>) => {
            state.loading = false;
            state.report = action.payload;
        });
        builder.addCase(fetchSellerReportById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });

        builder.addCase(updateSellerAccountStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateSellerAccountStatus.fulfilled, (state, action: PayloadAction<SellerResponse>) => {
            state.loading = false;
            state.updatedSeller = action.payload;
            state.sellers = state.sellers?.map(seller =>
                seller.id === action.payload.id ? action.payload : seller
            ) || null;
        });
        builder.addCase(updateSellerAccountStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });
    },
});

export default adminSellerSlice.reducer;
