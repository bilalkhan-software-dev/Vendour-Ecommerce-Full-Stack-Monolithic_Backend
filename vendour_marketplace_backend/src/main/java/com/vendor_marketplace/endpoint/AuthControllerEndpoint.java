package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.LoginRequest;
import com.vendor_marketplace.dto.request.RegisterRequest;
import com.vendor_marketplace.dto.request.SentOtpRequest;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.UnsupportedEncodingException;

@RequestMapping("/api/v1/auth")
public interface AuthControllerEndpoint {

    @PostMapping("/register")
    ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest);

    @PostMapping("/send/otp")
    ResponseEntity<?> sendOtpToMailForLoginAndRegister(@Valid @RequestBody SentOtpRequest sentOtpRequest) throws MessagingException, UnsupportedEncodingException;

    @PostMapping("/login")
    ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest);


    @PostMapping("/seller/login")
    ResponseEntity<?> loginSeller(@Valid @RequestBody LoginRequest loginRequest);



}
