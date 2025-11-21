package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.config.JazzCashConfig;
import com.vendor_marketplace.dto.response.JazzCashPaymentResponse;
import com.vendor_marketplace.exception.PaymentMismatchException;
import com.vendor_marketplace.exception.PaymentProcessingException;
import com.vendor_marketplace.utils.RandomUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JazzCashService {

    private final JazzCashConfig jazzCashConfig;
    private final RestTemplate restTemplate;

    public Map<String, String> createJazzCashRequest(String orderId, Long totalAmount, String mobileNo) {
        String txnRefNo = RandomUtil.toGenerateJazzCashTxnRefNo();
        String txnDateTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String expiryDateTime = new SimpleDateFormat("yyyyMMddHHmmss")
                .format(new Date(System.currentTimeMillis() + (2 * 60 * 60 * 1000))); // +2h

        // Create parameter map with only required fields
        Map<String, String> params = new LinkedHashMap<>();
        params.put("pp_Version", "1.1");
        params.put("pp_TxnType", "MWALLET");
        params.put("pp_Language", "EN");
        params.put("pp_MerchantID", jazzCashConfig.getMerchantId());
        params.put("pp_Password", jazzCashConfig.getPassword());
        params.put("pp_TxnRefNo", txnRefNo);
        params.put("pp_Amount", String.valueOf(totalAmount * 100)); // Convert to paisa
        params.put("pp_TxnCurrency", "PKR");
        params.put("pp_TxnDateTime", txnDateTime);
        params.put("mobileNo", mobileNo); // Customer mobile number
        params.put("pp_BillReference", orderId);
        params.put("pp_Description", "Order Payment");
        params.put("pp_TxnExpiryDateTime", expiryDateTime);

        // Generate and add secure hash (MUST be the last parameter)
        String secureHash = generateJazzCashSecureHash(params);
        params.put("pp_SecureHash", secureHash);

        log.debug("Created JazzCash request with {} parameters", params.size());
        return params;
    }

    public String generateJazzCashSecureHash(Map<String, String> params) {
        try {
            // Create hash string in exact order as required by JazzCash
            // Note: pp_SecureHash is NOT included in the hash calculation
            String hashString = jazzCashConfig.getIntegritySalt() + "&" +
                    params.get("pp_Amount") + "&" +
                    params.get("pp_BillReference") + "&" +
                    params.get("pp_Description") + "&" +
                    params.get("pp_Language") + "&" +
                    params.get("pp_MerchantID") + "&" +
                    params.get("pp_Password") + "&" +
                    params.get("pp_TxnCurrency") + "&" +
                    params.get("pp_TxnDateTime") + "&" +
                    params.get("pp_TxnExpiryDateTime") + "&" +
                    params.get("pp_TxnRefNo") + "&" +
                    params.get("pp_TxnType") + "&" +
                    params.get("pp_Version") + "&" +
                    params.get("mobileNo");

            log.debug("Hash string for secure hash: {}", hashString);

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(
                    jazzCashConfig.getIntegritySalt().getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            sha256_HMAC.init(secret_key);

            byte[] hashBytes = sha256_HMAC.doFinal(hashString.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }

            String generatedHash = sb.toString();
            log.debug("Generated secure hash: {}", generatedHash);

            return generatedHash;

        } catch (Exception e) {
            log.error("Error generating secure hash for JazzCash", e);
            throw new PaymentProcessingException("Secure hash generation failed");
        }
    }

    public JazzCashPaymentResponse sendPaymentRequestToJazzCash(Map<String, String> requestParams) {
        String txnRefNo = requestParams.get("pp_TxnRefNo");
        String mobileNo = requestParams.get("mobileNo");
        String orderId = requestParams.get("pp_BillReference");

        log.info("Sending payment request to Jazzcash - Transaction: {}, Mobile: {}, Order: {}",
                txnRefNo, mobileNo, orderId);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Build form-urlencoded request body
            StringBuilder formBody = new StringBuilder();
            for (Map.Entry<String, String> entry : requestParams.entrySet()) {
                if (!formBody.isEmpty()) {
                    formBody.append("&");
                }
                formBody.append(entry.getKey()).append("=").append(entry.getValue());
            }

            log.debug("JazzCash API request: {}", formBody.toString());

            HttpEntity<String> entity = new HttpEntity<>(formBody.toString(), headers);

            // Send request to JazzCash API
            ResponseEntity<JazzCashPaymentResponse> response = restTemplate.exchange(
                    jazzCashConfig.getBaseUrl() + "/ApplicationAPI/API/2.0/Payment/DoTransaction",
                    HttpMethod.POST,
                    entity,
                    JazzCashPaymentResponse.class
            );

            JazzCashPaymentResponse responseBody = response.getBody();
            log.info("JazzCash response - Code: {}, Message: {}",
                    responseBody != null ? responseBody.getPp_ResponseCode() : "NULL",
                    responseBody != null ? responseBody.getPp_ResponseMessage() : "NULL");

            return responseBody;

        } catch (Exception e) {
            log.error("JazzCash API call failed for transaction: {}", txnRefNo, e);
            throw new PaymentProcessingException("JazzCash API call failed: " + e.getMessage());
        }
    }

    public boolean validateJazzCashResponse(JazzCashPaymentResponse response, Long originalAmount) {
        try {
            if (response == null) {
                log.error("JazzCash response is null");
                return false;
            }

            String responseAmount = response.getPp_Amount();
            String expectedAmount = String.valueOf(originalAmount * 100); // Converting to paisa

            if (!responseAmount.equals(expectedAmount)) {
                log.error("Amount mismatch! Expected: {}, Received: {}", expectedAmount, responseAmount);
                throw new PaymentMismatchException("Amount tampering detected");
            }

            // Verify response code - "000" means success
            if (!"000".equals(response.getPp_ResponseCode())) {
                log.warn("JazzCash payment failed - Code: {}, Message: {}",
                        response.getPp_ResponseCode(), response.getPp_ResponseMessage());
                return false;
            }

            log.info("JazzCash payment successful for transaction: {}",
                    response.getPp_TxnRefNo());
            return true;

        } catch (PaymentMismatchException e) {
            throw e; // Re-throw specific exception
        } catch (Exception e) {
            log.error("JazzCash response validation error", e);
            return false;
        }
    }

    public String getTransactionReference(Map<String, String> requestParams) {
        return requestParams.get("pp_TxnRefNo");
    }

}