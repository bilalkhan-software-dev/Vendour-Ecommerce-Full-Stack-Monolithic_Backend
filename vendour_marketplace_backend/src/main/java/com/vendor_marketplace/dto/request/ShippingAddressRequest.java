package com.vendor_marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddressRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2–50 characters")
    private String name;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pin code is required")
    @Pattern(regexp = "^[0-9]{5}$", message = "Pin code must be exactly 5 digits")
    private String pinCode;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
            regexp = "^(?:\\+92|92|0)?3[0-9]{9}$",
            message = "Invalid Pakistani mobile number format"
    )
    private String mobile;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 200, message = "Address must be between 5–200 characters")
    private String address;

}
/*
Regex Explanation for Pakistani Mobile:  ^(?:\+92|92|0)?3[0-9]{9}$
(?:\+92|92|0)?  → optional prefix (+92, 92, or 0)
3[0-9]{9}       → Pakistani mobile numbers always start with 3 and have 10 digits total (e.g., 3001234567).
Examples that will pass: +923001234567,923001234567,03001234567
Examples that will fail: 1234567890,920312123456 (wrong format),03121234 (too short)
 */