package com.vendor_marketplace.dto.response;

import lombok.Data;

@Data
public class JazzCashPaymentResponse {

    private String pp_Version;
    private String pp_TxnType;
    private String pp_Language;
    private String pp_MerchantID;
    private String pp_Password;
    private String pp_TxnRefNo;
    private String pp_Amount;
    private String pp_TxnCurrency;
    private String pp_TxnDateTime;
    private String pp_BillReference;
    private String pp_Description;
    private String pp_TxnExpiryDateTime;
    private String pp_ReturnURL;
    private String pp_SecureHash;
    private String pp_ResponseCode;
    private String pp_ResponseMessage;
}
