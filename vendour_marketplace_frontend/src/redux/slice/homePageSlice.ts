import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CustomerHomeCategorySlice, HomeData } from "../../types/homeCategory";
import axios, { AxiosError } from "axios";
import { ALL_HOME_CATEGORIES_ENDPOINT } from "../../config/apiEndpoints";



export const fetchAllHomePageData = createAsyncThunk<
    HomeData,
    void,
    { rejectValue: string }
>(
    "/home/fetchAllHomePageData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${ALL_HOME_CATEGORIES_ENDPOINT}`);
            return response.data.data as HomeData;
        } catch (err) {
            console.log("Error: ", err);

            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch Home Category. Please try again.");
        }
    }
);


const initialState: CustomerHomeCategorySlice = {
    loading: false,
    homeData: null,
    error: null,
}

const homePageSlice = createSlice({
    name: "home",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllHomePageData.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllHomePageData.fulfilled, (state, action) => {
            state.loading = false;
            state.homeData = action.payload;
        });
        builder.addCase(fetchAllHomePageData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export default homePageSlice.reducer;
