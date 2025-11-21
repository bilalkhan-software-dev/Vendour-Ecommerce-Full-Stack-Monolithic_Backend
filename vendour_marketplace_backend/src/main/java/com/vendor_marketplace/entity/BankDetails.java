package com.vendor_marketplace.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankDetails {

    private String accountNumber;
    private String bankName;
    private String accountHolderName;
    private String IBAN;

    /// IBAN (International Bank Account Number) → Mandatory for   interbank transfers.
    /// Always starts with PK, followed by 22 digits (total length = 24 characters).
    /// Example: PK36SCBL0000001123456702
    }
