import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PagedResponse, ProductParamsRequest, ProductResponse, ProductSuggestionResponse } from "../../../types/product";
import type { AxiosError } from "axios";
import { USER_PRODUCT_DETAIL_BY_ID_ENDPOINT, USER_PRODUCT_SEARCH_ENDPOINT, USER_PRODUCTS_FILTER_ENDPOINT, USER_SIMILAR_PRODUCT_SEARCH_ENDPOINT } from "../../../config/apiEndpoints";
import axios from "axios";


export const fetchAllProducts = createAsyncThunk<
    PagedResponse,
    { params: ProductParamsRequest },
    { rejectValue: string }
>(
    "/product/fetchAllProducts",
    async ({ params }, { rejectWithValue }) => {
        console.log("Request params: ", params);
        try {
            const response = await axios.get(`${USER_PRODUCTS_FILTER_ENDPOINT}`, {
                params: {
                    ...params,
                    pageNumber: params.pageNumber || 0
                }
            });
            console.log("All Products: ", response.data);
            return response.data.data as PagedResponse;
        } catch (err) {
            console.log("Error: ", err);

            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Seller Products. Please try again.");
        }
    }
);

export const searchProducts = createAsyncThunk<
    ProductSuggestionResponse[],
    { query: string },
    { rejectValue: string }
>(
    "/product/searchProducts",
    async ({ query }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${USER_PRODUCT_SEARCH_ENDPOINT}?query=${query}`);
            console.log("Search Products: ", response.data.data)
            return response.data.data as ProductSuggestionResponse[];
        } catch (err) {
            console.log("Error: ", err);
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Search Products. Please try again.");
        }
    }
);

export const similarProducts = createAsyncThunk<
    ProductResponse[],
    { productId: number },
    { rejectValue: string }
>(
    "/product/similarProducts",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${USER_SIMILAR_PRODUCT_SEARCH_ENDPOINT}`.replace(":productId", productId.toString()));
            console.log("similar Products: ", response.data.data)
            return response.data.data as ProductResponse[];
        } catch (err) {
            console.log("Error: ", err);
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Similar Products. Please try again.");
        }
    }
);

export const productDetailById = createAsyncThunk<
    ProductResponse,
    { productId: number | null },
    { rejectValue: string }
>(
    "/product/productDetailById",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${USER_PRODUCT_DETAIL_BY_ID_ENDPOINT}/${productId}`);
            console.log("Product detail: ", response.data.data)
            return response.data.data as ProductResponse;
        } catch (err) {
            console.log("Error: ", err);

            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch product detail");
        }
    }
);

interface ProductState {
    product: ProductResponse | null,
    searchProducts: ProductSuggestionResponse[] | null,
    totalPages: number,
    products: PagedResponse | null,
    similarProducts: ProductResponse[] | null,
    loading: boolean,
    error: string | null | undefined
}

const initialState: ProductState = {
    product: null,
    searchProducts: [],
    similarProducts: [],
    totalPages: 1,
    products: null,
    loading: false,
    error: null
}


const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
            state.totalPages = action.payload.totalPages ?? 0;
        });
        builder.addCase(fetchAllProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch all products';
        });
        builder.addCase(searchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(searchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.searchProducts = action.payload;
        });
        builder.addCase(searchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(similarProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(similarProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.similarProducts = action.payload;
        });
        builder.addCase(similarProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(productDetailById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(productDetailById.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        });
        builder.addCase(productDetailById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    }
});

export default productSlice.reducer;





