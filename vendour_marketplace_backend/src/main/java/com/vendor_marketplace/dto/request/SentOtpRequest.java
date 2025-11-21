package com.vendor_marketplace.dto.request;

import com.vendor_marketplace.entity.enums.USER_ROLE;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SentOtpRequest {

    @NotBlank(message = "Email cannot be null")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Role must be required")
    private USER_ROLE role;

}
