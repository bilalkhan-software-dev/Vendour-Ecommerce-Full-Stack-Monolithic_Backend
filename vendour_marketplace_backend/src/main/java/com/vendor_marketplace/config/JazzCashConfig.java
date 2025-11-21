package com.vendor_marketplace.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jazzcash")
@Data
public class JazzCashConfig {
    private String merchantId;
    private String password;
    private String integritySalt;
    private String returnUrl;
    private String baseUrl; // sandbox or production URL
}
