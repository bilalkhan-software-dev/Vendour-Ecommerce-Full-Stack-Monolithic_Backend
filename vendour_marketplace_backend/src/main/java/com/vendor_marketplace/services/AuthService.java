package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.response.AuthResponse;
import com.vendor_marketplace.dto.request.LoginRequest;
import com.vendor_marketplace.dto.request.RegisterRequest;
import com.vendor_marketplace.dto.request.SentOtpRequest;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface AuthService {


    AuthResponse registerUser(RegisterRequest registerRequest);

    AuthResponse loginUser(LoginRequest loginRequest);

    void getOtpForRegisterOrLogin(SentOtpRequest verificationCodeRequest) throws MessagingException, UnsupportedEncodingException;

}
