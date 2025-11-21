package com.vendor_marketplace.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Mobile must be between 10 and 15 digits")
    private String mobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "OTP cannot be blank")
    @Size(min = 6, max = 6, message = "OTP must be 6 characters")
    private String otp;


    @Valid
    private SellerBankDetails bankDetails;

    @Valid
    private SellerBusinessDetails businessDetails;

    @Valid
    private Address pickupAddress;

    @Pattern(regexp = "^[0-9]{6,20}$", message = "Invalid STRN format")
    @JsonProperty("strn")
    private String STRN;

    // ================= NESTED CLASSES =================

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SellerBankDetails {
        @NotBlank(message = "Account number is required")
        @Pattern(regexp = "^[0-9]{10,20}$", message = "Account number must be 10–20 digits")
        private String accountNumber;

        @NotBlank(message = "Bank name is required")
        private String bankName;

        @NotBlank(message = "Account holder name is required")
        private String accountHolderName;

        @NotBlank(message = "Account number (IBAN) is required")
        @Pattern(
                regexp = "^PK\\d{2}[A-Z0-9]{20}$",
                message = "Invalid IBAN format, must be 24 characters starting with PK"
        )
        @JsonProperty("iban")
        private String IBAN;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SellerBusinessDetails {
        @NotBlank(message = "Business name is required")
        private String businessName;

        @NotBlank(message = "Business address is required")
        private String businessAddress;

        @Pattern(regexp = "^[0-9]{10,15}$", message = "Business mobile must be 10–15 digits")
        private String businessMobileNumber;

        @Email(message = "Invalid business email format")
        private String businessEmail;

        private String banner;
        private String logo;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Address {
        @NotBlank(message = "Receiver name is required")
        private String name;

        @NotBlank(message = "Locality is required")
        private String locality;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "State is required")
        private String state;

        @NotBlank(message = "Pincode is required")
        @Pattern(regexp = "^[0-9]{5,10}$", message = "Invalid pincode")
        private String pinCode;

        @Pattern(regexp = "^[0-9]{10,15}$", message = "Mobile must be 10–15 digits")
        private String mobile;

        @NotBlank(message = "Address is required")
        @Size(min = 5, message = "Address must be at least 5 characters")
        private String address; // Location where the order will deliver
    }
}
