package com.vendor_marketplace.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDetails {

    private String businessName;
    private String businessAddress;
    private String businessMobileNumber;
    private String businessEmail;
    private String logo;
    private String banner;

}

