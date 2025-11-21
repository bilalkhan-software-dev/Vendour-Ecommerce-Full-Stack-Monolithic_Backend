package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.response.AuthResponse;
import com.vendor_marketplace.dto.request.LoginRequest;
import com.vendor_marketplace.dto.request.RegisterRequest;
import com.vendor_marketplace.dto.request.SentOtpRequest;
import com.vendor_marketplace.endpoint.AuthControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

import static com.vendor_marketplace.utils.Constants.SELLER_PREFIX;

@RestController
@RequiredArgsConstructor
@Validated
public class AuthController implements AuthControllerEndpoint {

    private final AuthService authService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> registerUser(RegisterRequest registerRequest) {

        AuthResponse authResponse = authService.registerUser(registerRequest);

        if (!ObjectUtils.isEmpty(authResponse)) {
            return response.createBuildResponse("User registered successfully!", authResponse, HttpStatus.CREATED);
        }

        return response.createBuildResponseMessage("Failed to register user!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> sendOtpToMailForLoginAndRegister(SentOtpRequest sentOtpRequest) throws MessagingException, UnsupportedEncodingException {
        authService.getOtpForRegisterOrLogin(sentOtpRequest);
        return response.createBuildResponseMessage("OTP sent successfully to your email: " + sentOtpRequest.getEmail(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> loginUser(LoginRequest loginRequest) {

        AuthResponse authResponse = authService.loginUser(loginRequest);
        if (!ObjectUtils.isEmpty(authResponse)) {
            return response.createBuildResponse("User logged In successfully!", authResponse, HttpStatus.OK);
        }
        return response.createBuildResponseMessage("Failed to login user!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<?> loginSeller(LoginRequest loginRequest) {

        loginRequest.setEmail(SELLER_PREFIX+loginRequest.getEmail());

        AuthResponse authResponse = authService.loginUser(loginRequest);

        if (!ObjectUtils.isEmpty(authResponse)) {
            return response.createBuildResponse("Seller logged In successfully!", authResponse, HttpStatus.OK);
        }


        return response.createBuildResponseMessage("Failed to login seller!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
