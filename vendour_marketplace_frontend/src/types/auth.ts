import type { UserResponse } from "./user";

export interface AuthResponse {
    email: string;
    role: string;
    token: string;
}

export interface AuthRequest {
    email: string;
    otp: string;
}

export interface SignupRequest {
    email: string;
    fullName: string;
    otp: string,
    mobile?: string


}

export interface SentOtpRequest {
    email: string;
    role: string;
}

export interface AuthSliceState {
    loading: boolean,
    token: string | null | undefined,
    isAuthenticated: boolean,
    isOtpSent: boolean,
    user: UserResponse | null,
    error: string | null | undefined,
    otpSentMessage?: string | null
}



