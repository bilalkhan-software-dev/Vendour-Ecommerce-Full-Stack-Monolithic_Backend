import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { USER_ADD_PRODUCT_TO_WISHLIST_ENDPOINT, USER_WISHLISTS_ENDPOINT } from "../../../config/apiEndpoints";
import type { AxiosError } from "axios";
import { api } from "../../../config/api";
import type { WishlistResponse, WishlistSliceState } from "../../../types/wishlist";


export const addProductToWishlist = createAsyncThunk<
    WishlistResponse,
    { productId: number },
    { rejectValue: string }
>("/wishlist/addProductToWishlist", async ({ productId }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${USER_ADD_PRODUCT_TO_WISHLIST_ENDPOINT}/${productId}`);
        return response.data.data as WishlistResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to add product to wishlist. Please try again later."
        );
    }
});

export const fetchUserWishlists = createAsyncThunk<
    WishlistResponse,
    void,
    { rejectValue: string }
>("/wishlist/fetchUserWishlists", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${USER_WISHLISTS_ENDPOINT}`);
        return response.data.data as WishlistResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch wishlists. Please try again later."
        );
    }
});

const initialState: WishlistSliceState = {
    loading: false,
    error: null,
    wishlists: null,
    wishlist: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addProductToWishlist.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addProductToWishlist.fulfilled, (state, action: PayloadAction<WishlistResponse>) => {
            state.loading = false;
            state.wishlist = action.payload;

        });
        builder.addCase(addProductToWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? "Failed to add product to wishlist.";
        });

        builder.addCase(fetchUserWishlists.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserWishlists.fulfilled, (state, action: PayloadAction<WishlistResponse>) => {
            state.loading = false;
            state.wishlists = action.payload;
        });
        builder.addCase(fetchUserWishlists.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? "Failed to fetch wishlists.";
        });
    },
});

export default wishlistSlice.reducer;
