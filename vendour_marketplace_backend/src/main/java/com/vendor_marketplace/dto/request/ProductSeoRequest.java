package com.vendor_marketplace.dto.request;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSeoRequest {
    
    private String name;
    private String category;
    private String features;
    
}
