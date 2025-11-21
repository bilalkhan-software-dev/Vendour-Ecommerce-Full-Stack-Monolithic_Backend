import type { AxiosError } from "axios";
import type { ProductRequest, ProductResponse } from "../../../types/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../../config/api";
import { SELLER_PRODUCT_ADD_ENDPOINT, SELLER_PRODUCT_UPDATE_ENDPOINT, SELLER_PRODUCTS_ENDPOINT } from "../../../config/apiEndpoints";


export const fetchSellerProducts = createAsyncThunk<
    ProductResponse[],
    void,
    { rejectValue: string }
>(
    "/sellerProduct/fetchSellerProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(SELLER_PRODUCTS_ENDPOINT);
            console.log("Seller Products: ", response.data.data)
            return response.data.data as ProductResponse[];
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller Products. Please try again.");
        }
    }
);

export const createProduct = createAsyncThunk<
    ProductResponse,
    ProductRequest,
    { rejectValue: string }
>(
    "/sellerProduct/createProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(SELLER_PRODUCT_ADD_ENDPOINT, payload);
            console.log("Seller Create Products: ", response.data.data)
            return response.data.data as ProductResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Craete Seller Products. Please try again.");
        }
    }
);
export const updateProduct = createAsyncThunk<
    ProductResponse,
    { productId: number; request: ProductRequest },
    { rejectValue: string }
>(
    "/sellerProduct/updateProduct",
    async ({ request, productId }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${SELLER_PRODUCT_UPDATE_ENDPOINT}/${productId}`, request);
            console.log("Seller Update Products: ", response.data.data)
            return response.data.data as ProductResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to update Seller Products. Please try again.");
        }
    }
);

interface SellerProductState {
    products: ProductResponse[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: SellerProductState = {
    products: null,
    loading: false,
    error: null,
}

const sellerProductSlice = createSlice({
    name: "sellerProduct",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSellerProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchSellerProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchSellerProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch products';
        });
        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products?.push(action.payload);
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to addd products';
        });
        builder.addCase(updateProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload;
            const index = state.products?.findIndex(p => p.id === updatedProduct.id);
            if (index !== undefined && index !== -1 && state.products) {
                state.products[index] = updatedProduct;
            }

        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to addd products';
        });
    }
});

export default sellerProductSlice.reducer;
