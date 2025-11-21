import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { LOGIN_REQUEST_ENDPOINT, SENT_SIGNIN_UP_OTP_REQUEST_ENDPOINT, SIGNUP_REQUEST_ENDPOINT, USER_PROFILE_ENDPOINT } from "../../config/apiEndpoints";
import type { AuthResponse, AuthRequest, SentOtpRequest, AuthSliceState, SignupRequest } from "../../types/auth";
import type { NavigateFunction } from "react-router-dom";
import type { UserResponse } from "../../types/user";
import { api } from "../../config/api";




export const sentSigninUpOtp = createAsyncThunk<
    { message: string },
    SentOtpRequest, // argument type
    { rejectValue: string } // error type
>("/auth/sentSignUpOtp", async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            SENT_SIGNIN_UP_OTP_REQUEST_ENDPOINT,
            payload
        );
        return response.data.message;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }

        return rejectWithValue("Failed to send OTP. Please try again.");
    }
});

export const signin = createAsyncThunk<
    AuthResponse, // return type
    AuthRequest, // argument type
    { rejectValue: string } // error type
>("/auth/signin", async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            LOGIN_REQUEST_ENDPOINT,
            payload
        );
        const token = response.data?.data?.token;
        if (token) {
            localStorage.setItem("jwt", token);
        }
        return response.data.data as AuthResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Login Failed!.");
    }
});

export const signup = createAsyncThunk<
    AuthResponse, // return type
    SignupRequest, // argument type
    { rejectValue: string } // error type
>("/auth/signup", async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            SIGNUP_REQUEST_ENDPOINT,
            payload
        );

        const token = response.data?.data?.token;
        if (token) {
            localStorage.setItem("jwt", token);
        }

        return response.data.data as AuthResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Signup Failed!.");
    }
});
export const fetchUserProfile = createAsyncThunk<
    UserResponse, // return type
    void, // argument type
    { rejectValue: string } // error type
>("/auth/fetchUserProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(USER_PROFILE_ENDPOINT);
        console.log("Response user profile: ", response.data);
        return response.data.data as UserResponse;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Error auth: ", error);

        if (error.response?.data?.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Fetching User Profile Failed!.");
    }
});


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




const initialState: AuthSliceState = {
    loading: false,
    error: null,
    isAuthenticated: false,
    user: null,
    token: null,
    otpSentMessage: null,
    isOtpSent: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sentSigninUpOtp.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sentSigninUpOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.otpSentMessage = action.payload.message;
            state.isOtpSent = true;
        });
        builder.addCase(sentSigninUpOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(signin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signin.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        });
        builder.addCase(signin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(signup.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signup.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
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

export default authSlice.reducer;