import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthRequest, AuthResponse } from "../../../types/auth";
import axios, { AxiosError } from "axios";
import { RESEND_SELLER_EMAIL_VERIFY_LINK_ENDPOINT, SELLER_LOGIN_REQUEST_ENDPOINT, SELLER_REGISTER_ENDPOINT, VERIFY_SELLER_EMAIL_ENDPOINT } from "../../../config/apiEndpoints";
import type { NavigateFunction } from "react-router-dom";
import type { SellerResponse } from "../../../types/seller";



export const sellerLogin = createAsyncThunk<
    AuthResponse,
    AuthRequest,
    { rejectValue: string }
>("/sellerAuth/sellerLogin", async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            SELLER_LOGIN_REQUEST_ENDPOINT,
            payload
        );

        console.log("Response auth seller signin: ", response.data);
        const jwtToken = response.data.data.token;
        if (jwtToken) {
            localStorage.setItem("jwt", jwtToken);
        }
        return response.data.data as AuthResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Error auth: ", error);

        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Seller Login Failed!.");
    }
});

export const sellerSignup = createAsyncThunk<
    AuthResponse,
    AuthRequest,
    { rejectValue: string }
>("/sellerAuth/sellerSignup", async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            SELLER_REGISTER_ENDPOINT,
            payload
        );

        console.log("Response auth seller signup: ", response.data);
        const jwtToken = response.data.data.token;
        if (jwtToken) {
            localStorage.setItem("jwt", jwtToken);
        }
        return response.data.data as AuthResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Error auth: ", error);

        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Unable to register seller. Please try again later!");
    }
});


export const verifyEmail = createAsyncThunk<
    SellerResponse,
    { email: string, otp: string },
    { rejectValue: string }
>(
    "/seller/verifyEmail",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${VERIFY_SELLER_EMAIL_ENDPOINT.replace(":email", email).replace(":otp", otp)}`);

            return response.data.data as SellerResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to verify seller email. Please try again later.");
        }
    }
);
export const resendVerificationEmail = createAsyncThunk<
    string,
    { email: string },
    { rejectValue: string }
>(
    "/seller/resendVerificationEmail",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RESEND_SELLER_EMAIL_VERIFY_LINK_ENDPOINT.replace(":email", email)}`);

            return response.data.message as string;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.log("error: ",error);

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to resend email. Please try again later.");
        }
    }
);


export const logout = createAsyncThunk<
    void, // return type
    { navigate: NavigateFunction }, // payload type
    { rejectValue: string } // thunkApi config
>(
    "/auth/logout",
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




interface SellerAuthSliceState {
    loading: boolean;
    token: string | null;
    error: string | null | undefined;
    isAuthenticated: boolean;
    emailVerified: boolean
}

const initialState: SellerAuthSliceState = {
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null,
    emailVerified: false
}

const sellerAuthSlice = createSlice({
    name: "sellerAuth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(sellerSignup.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(sellerSignup.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        });
        builder.addCase(sellerSignup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(sellerLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(sellerLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        });
        builder.addCase(sellerLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(verifyEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(verifyEmail.fulfilled, (state) => {
            state.loading = false;
            state.emailVerified = true;
        }
        );
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
            state.emailVerified = false;
        });

        builder.addCase(resendVerificationEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resendVerificationEmail.fulfilled, (state) => {
            state.loading = false;
        }
        );
        builder.addCase(resendVerificationEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong.";
        });

        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled,
            () => initialState);
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export default sellerAuthSlice.reducer;