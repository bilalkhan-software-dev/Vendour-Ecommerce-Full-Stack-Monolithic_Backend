package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.SellerRequest;
import com.vendor_marketplace.dto.request.UpdateSellerRequest;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;
import static com.vendor_marketplace.utils.Constants.FOR_SELLER_ONLY;

@RequestMapping("/api/v1/sellers")
public interface SellerControllerEndpoint {

    @PostMapping("/register")
    ResponseEntity<?> registerSeller(@Valid @RequestBody SellerRequest sellerRequest) throws MessagingException, UnsupportedEncodingException;

    @GetMapping("/profile")
    @PreAuthorize(FOR_SELLER_ONLY)
    ResponseEntity<?> getSellerProfile(@RequestHeader(AUTHORIZATION_HEADER) String jwtToken);

    @PreAuthorize(FOR_SELLER_ONLY)
    @PutMapping("/update")
    ResponseEntity<?> updateSellerProfile(@RequestHeader(AUTHORIZATION_HEADER) String jwtToken, @Valid @RequestBody UpdateSellerRequest sellerRequest);

    @PutMapping("/verify-email/{email}")
    ResponseEntity<?> verifyEmail(@PathVariable String email, @RequestParam String otp);

    @GetMapping("/resend/email/verification/link/{email}")
    ResponseEntity<?> resendEmailVerificationLink(@PathVariable String email);

    @PreAuthorize(FOR_SELLER_ONLY)
    @GetMapping("/report")
    ResponseEntity<?> getSellerReport(@RequestHeader(AUTHORIZATION_HEADER) String jwtToken);

}
