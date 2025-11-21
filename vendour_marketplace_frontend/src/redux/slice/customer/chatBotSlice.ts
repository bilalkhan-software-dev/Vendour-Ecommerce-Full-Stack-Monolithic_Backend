import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {  ASK_AI_PRODUCT_DETAILS_ENDPOINT, ASK_AI_PUBLIC_ENDPOINT, ASK_AI_WITH_LOGIN_ENDPOINT } from "../../../config/apiEndpoints";
import { api } from "../../../config/api";

export const askAiAboutProduct = createAsyncThunk<
    string,
    { productId: number; question: string },
    { rejectValue: string }
>(
    "/chatbot/askAiAboutProduct",
    async ({ productId, question }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${ASK_AI_PRODUCT_DETAILS_ENDPOINT}`
                    .replace(":productId", productId.toString())
                    .replace(":question", encodeURIComponent(question))
            );
            return response.data as string;
        } catch (err) {
            console.log("Error: ", err);
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch AI product response. Please try again.");
        }
    }
);

export const askAi = createAsyncThunk<
    string,
    { question: string },
    { rejectValue: string }
>(
    "/chatbot/askAi",
    async ({ question }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${ASK_AI_PUBLIC_ENDPOINT}`.replace(":question", encodeURIComponent(question))
            );
            return response.data as string;
        } catch (err) {
            console.log("Error: ", err);
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch AI public response. Please try again.");
        }
    }
);

export const askAiWithCredentials = createAsyncThunk<
    string,
    { question: string },
    { rejectValue: string }
>(
    "/chatbot/askAiWithCredentials",
    async ({ question }, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `${ASK_AI_WITH_LOGIN_ENDPOINT}`.replace(":question", encodeURIComponent(question))
            );
            console.log("response user chat: ",response.data);
            
            return response.data as string;
        } catch (err) {
            console.log("Error: ", err);
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch AI response. Please try again.");
        }
    }
);

interface ChatotSliceState {
    loading: boolean;
    error: string | null | undefined;
    productResponse: string | null | undefined;
    response: string | null | undefined;
}

const initialState: ChatotSliceState = {
    loading: false,
    error: null,
    productResponse: null,
    response: null,
};

const chatbotSlice = createSlice({
    name: "chatbot",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(askAiAboutProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(askAiAboutProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.productResponse = action.payload;
        });
        builder.addCase(askAiAboutProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(askAi.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(askAi.fulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
        });
        builder.addCase(askAi.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(askAiWithCredentials.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(askAiWithCredentials.fulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
        });
        builder.addCase(askAiWithCredentials.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    },
});

export default chatbotSlice.reducer;
