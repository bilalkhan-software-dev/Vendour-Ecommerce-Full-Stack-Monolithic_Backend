import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { } from "../../../types/user";
import type { CouponRequest, CouponResponse, CouponSliceState } from "../../../types/coupon";
import type { NavigateFunction } from "react-router-dom";
import { api } from "../../../config/api";
import { CREATE_COUPON_ENDPOINT, DELETE_COUPON_ENDPOINT, GET_ALL_COUPON_ENDPOINT, UPDATE_COUPON_ENDPOINT } from "../../../config/apiEndpoints";
import type { AxiosError } from "axios";

export const createCoupon = createAsyncThunk<
    CouponResponse,
    { request: CouponRequest },
    { rejectValue: string }
>("/coupon/createCoupon", async ({ request }, { rejectWithValue }) => {
    try {

        const response = await api.post(CREATE_COUPON_ENDPOINT, request);
        console.log("Create coupon: ", response.data);
        return response.data.data as CouponResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data.message || "Unable to create coupon. Please try again later."
        );
    }
});



export const updateCoupon = createAsyncThunk<
    CouponResponse,
    { request: CouponRequest, couponId: number },
    { rejectValue: string }
>("/coupon/updateCoupon", async ({ request, couponId }, { rejectWithValue }) => {
    try {

        const response = await api.put(UPDATE_COUPON_ENDPOINT.replace(":couponId", couponId.toString()), request);
        console.log("Update coupon: ", response.data);
        return response.data.data as CouponResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data.message || "Unable to create coupon. Please try again later."
        );
    }
});

export const deleteCoupon = createAsyncThunk<
    string,
    { couponId: number },
    { rejectValue: string }
>("/coupon/deleteCoupon", async ({ couponId }, { rejectWithValue }) => {
    try {

        const response = await api.delete(DELETE_COUPON_ENDPOINT.replace(":couponId", couponId.toString()));
        console.log("Delete coupon: ", response.data);
        return response.data.message as string;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data.message || "Unable to delete coupon. Please try again later."
        );
    }
});

export const allCoupons = createAsyncThunk<
    CouponResponse[],
    {couponStatus? : string},
    { rejectValue: string }
>("/coupon/allCoupons", async ({couponStatus}, { rejectWithValue }) => {
    try {

        const response = await api.get(`${GET_ALL_COUPON_ENDPOINT}?CouponStatus=${couponStatus}`);
        console.log("All coupon: ", response.data);
        return response.data.data as CouponResponse[];
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data.message || "Unable to fetch all coupons. Please try again later."
        );
    }
});




export const logoutCoupon = createAsyncThunk<
    void, // return type
    { navigate: NavigateFunction }, // payload type
    { rejectValue: string } // thunkApi config
>(
    "/coupon/logout",
    async ({ navigate }, { rejectWithValue }) => {
        try {
            localStorage.removeItem("jwt");
            navigate("/");
            return;
        } catch (error) {
            console.error("Error: ", error);
            return rejectWithValue("Failed to logout");
        }
    }
);

const initialState: CouponSliceState = {
    coupons: [],
    loading: false,
    coupon: null,
    error: null,
    isCouponCreated: false,
}

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {


        builder.addCase(createCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCoupon.fulfilled, (state, action: PayloadAction<CouponResponse>) => {
            state.isCouponCreated = true;
            state.loading = false;
        });
        builder.addCase(createCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(updateCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateCoupon.fulfilled, (state, action) => {
            state.coupon = action.payload;
            state.loading = false;
            if (state.coupons && state.coupons.length > 0) {
                state.coupons = state.coupons?.map(item =>
                    item.couponId === action.payload.couponId ? action.payload : item
                );
            }
        });
        builder.addCase(updateCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(deleteCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteCoupon.fulfilled, (state, action) => {
            state.loading =false;
            state.coupons = state.coupons.filter(item => item.couponId !== action.meta.arg.couponId)
        });
        builder.addCase(deleteCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(allCoupons.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(allCoupons.fulfilled, (state, action) => {
            state.loading =false;
            state.coupons = action.payload;

        });
        builder.addCase(allCoupons.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(logoutCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logoutCoupon.fulfilled, () => initialState);
        builder.addCase(logoutCoupon.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });







    }

})

export default couponSlice.reducer;

