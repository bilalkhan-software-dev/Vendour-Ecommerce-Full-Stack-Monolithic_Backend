import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddReviewRequest, ReviewResponse, ReviewSliceState } from "../../../types/review";
import { api } from "../../../config/api";
import {
    MY_REVIEWS_ENDPOINT,
    USER_REVIEW_ADD_ON_PRODUCT_ENDPOINT,
    USER_REVIEW_DELETE_ON_PRODUCT_ENDPOINT,
    USER_REVIEW_UPDATE_ON_PRODUCT_ENDPOINT,
    USERS_REVIEWS_ON_PRODUCT_ENDPOINT
} from "../../../config/apiEndpoints";
import type { AxiosError } from "axios";

// Add Review
export const addReview = createAsyncThunk<
    ReviewResponse,
    { request: AddReviewRequest; productId: number },
    { rejectValue: string }
>("/review/addReview", async ({ request, productId }, { rejectWithValue }) => {
    try {
        const response = await api.post(
            `${USER_REVIEW_ADD_ON_PRODUCT_ENDPOINT}/${productId}`,
            request
        );
        return response.data.data as ReviewResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to add review. Please try again later."
        );
    }
});

// Update Review
export const updateReview = createAsyncThunk<
    ReviewResponse,
    { request: AddReviewRequest; reviewId: number },
    { rejectValue: string }
>("/review/updateReview", async ({ request, reviewId }, { rejectWithValue }) => {
    try {
        const response = await api.put(
            `${USER_REVIEW_UPDATE_ON_PRODUCT_ENDPOINT}/${reviewId}`,
            request
        );
        return response.data.data as ReviewResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to update review. Please try again later."
        );
    }
});

// Delete Review
export const deleteReview = createAsyncThunk<
    string,
    { reviewId: number },
    { rejectValue: string }
>("/review/deleteReview", async ({ reviewId }, { rejectWithValue }) => {
    try {
        const response = await api.delete(
            `${USER_REVIEW_DELETE_ON_PRODUCT_ENDPOINT}/${reviewId}`
        );
        return response.data.message as string;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to delete review. Please try again later."
        );
    }
});

// Fetch Product Reviews
export const fetchProductReviews = createAsyncThunk<
    ReviewResponse[],
    { productId: number },
    { rejectValue: string }
>("/review/fetchProductReviews", async ({ productId }, { rejectWithValue }) => {
    try {
        const response = await api.get(
            `${USERS_REVIEWS_ON_PRODUCT_ENDPOINT}/${productId}`
        );
        return response.data.data as ReviewResponse[];
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch product reviews. Please try again later."
        );
    }
});

export const fetchMyReviews = createAsyncThunk<
    ReviewResponse[],
    void,
    { rejectValue: string }
>("/review/fetchMyReviews", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(
            `${MY_REVIEWS_ENDPOINT}`
        );
        return response.data.data as ReviewResponse[];
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch reviews. Please try again later."
        );
    }
});

const initialState: ReviewSliceState = {
    loading: false,
    error: null,
    productReviews: [],
    myReviews: [],
    review: null,
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(addReview.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addReview.fulfilled, (state, action: PayloadAction<ReviewResponse>) => {
            state.loading = false;
            // state.myReviews.push(action.payload)
            state.review = action.payload;
        });
        builder.addCase(addReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to add review.";
        });


        builder.addCase(updateReview.fulfilled, (state, action) => {
            state.loading = false;
            const idx = state.myReviews.findIndex((r) => r.id === action.payload.id);
            if (idx !== -1) state.myReviews[idx] = action.payload;
            state.review = action.payload;
        });


        builder.addCase(deleteReview.pending, (state) => {
            state.loading = true;
            state.error = null;
        });


        builder.addCase(deleteReview.fulfilled, (state, action) => {
            state.loading = false;
            state.myReviews = state.myReviews.filter((r) => r.id !== Number(action.meta.arg.reviewId));
            state.productReviews = state.productReviews.filter((r) => r.id !== Number(action.meta.arg.reviewId));
        });

        builder.addCase(deleteReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });


        builder.addCase(fetchProductReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.productReviews = action.payload;
        });
        builder.addCase(fetchProductReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Unable to fetch products review. Please try again.";
        });

        builder.addCase(fetchMyReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMyReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.myReviews = action.payload;
        });
        builder.addCase(fetchMyReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch reviews.";
        });
    },
});

export default reviewSlice.reducer;
