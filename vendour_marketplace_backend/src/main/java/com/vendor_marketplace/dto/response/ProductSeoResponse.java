package com.vendor_marketplace.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSeoResponse {
    private String title;
    private String description;
}
