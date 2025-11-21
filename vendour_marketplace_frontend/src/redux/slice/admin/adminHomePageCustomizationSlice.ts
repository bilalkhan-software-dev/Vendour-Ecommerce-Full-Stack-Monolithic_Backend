import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
    AdminHomeCategorySlice,
    HomeCategoryRequest,
    HomeCategoryResponse,
    HomeData,
} from "../../../types/homeCategory";
import axios, { AxiosError } from "axios";
import {
    ALL_HOME_CATEGORIES_ENDPOINT,
    CREATE_HOME_CATEGORIES_ENDPOINT,
    CREATE_HOME_CATEGORY_ENDPOINT,
    DELETE_HOME_CATEGORIY_ENDPOINT,
    UPDATE_HOME_CATEGORIES_ENDPOINT,
} from "../../../config/apiEndpoints";
import { api } from "../../../config/api";

export const createHomeCategories = createAsyncThunk<
    HomeData,
    { homeCategoryRequest: HomeCategoryRequest[] },
    { rejectValue: string }
>(
    "adminHomeCustomization/createHomeCategories",
    async ({ homeCategoryRequest }, { rejectWithValue }) => {
        try {
            const response = await api.post(CREATE_HOME_CATEGORIES_ENDPOINT, homeCategoryRequest);
            return response.data.data as HomeData;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error creating home categories:", error);
            return rejectWithValue(error.response?.data?.message ?? "Failed to create home categories.");
        }
    }
);

export const addToHomeCategory = createAsyncThunk<
    HomeCategoryResponse,
    { homeCategoryRequest: HomeCategoryRequest },
    { rejectValue: string }
>(
    "adminHomeCustomization/addToHomeCategory",
    async ({ homeCategoryRequest }, { rejectWithValue }) => {
        try {
            const response = await api.post(CREATE_HOME_CATEGORY_ENDPOINT, homeCategoryRequest);
            return response.data.data as HomeCategoryResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error adding home category:", error);
            return rejectWithValue(error.response?.data?.message ?? "Failed to add home category.");
        }
    }
);

export const updateHomeCategories = createAsyncThunk<
    HomeCategoryResponse,
    { homeCategoryId: number; homeCategoryRequest: HomeCategoryRequest },
    { rejectValue: string }
>(
    "adminHomeCustomization/updateHomeCategories",
    async ({ homeCategoryId, homeCategoryRequest }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                UPDATE_HOME_CATEGORIES_ENDPOINT.replace(":homeCategoryId", homeCategoryId.toString()),
                homeCategoryRequest
            );
            return response.data.data as HomeCategoryResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error updating home category:", error);
            return rejectWithValue(error.response?.data?.message ?? "Failed to update home category.");
        }
    }
);

export const deleteHomeCategory = createAsyncThunk<
    string,
    { homeCategoryId: number },
    { rejectValue: string }
>(
    "adminHomeCustomization/deleteHomeCategory",
    async ({ homeCategoryId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                DELETE_HOME_CATEGORIY_ENDPOINT.replace(":homeCategoryId", homeCategoryId.toString())
            );
            return response.data.message as string;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error deleting home category:", error);
            return rejectWithValue(error.response?.data?.message ?? "Failed to delete home category.");
        }
    }
);

export const fetchAllHomePageData = createAsyncThunk<
    HomeData,
    void,
    { rejectValue: string }
>(
    "adminHomeCustomization/fetchAllHomePageData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(ALL_HOME_CATEGORIES_ENDPOINT);
            return response.data.data as HomeData;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error fetching all home page data:", error);
            return rejectWithValue(error.response?.data?.message ?? "Failed to fetch home data.");
        }
    }
);

const initialState: AdminHomeCategorySlice = {
    loading: false,
    homePageCategories: null,
    homeCategory: null,
    homeCategories: [],
    error: null,
};

const adminHomePageCustomizationSlice = createSlice({
    name: "adminHomeCustomization",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createHomeCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHomeCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.homePageCategories = action.payload;
            })
            .addCase(createHomeCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAllHomePageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllHomePageData.fulfilled, (state, action) => {
                state.loading = false;
                state.homePageCategories = action.payload;
            })
            .addCase(fetchAllHomePageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateHomeCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHomeCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.homeCategory = action.payload;

                state.homeCategories = state.homeCategories.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(updateHomeCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteHomeCategory.fulfilled, (state, action) => {
                state.homeCategories = state.homeCategories.filter(
                    (item) => item.id !== Number(action.meta.arg.homeCategoryId)
                );
            })
            .addCase(deleteHomeCategory.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default adminHomePageCustomizationSlice.reducer;
