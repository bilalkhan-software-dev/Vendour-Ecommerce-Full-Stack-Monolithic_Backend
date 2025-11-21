package com.vendor_marketplace.controller;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentCallbackController {

    private final PaymentService paymentService;
    private final GenericResponseHandler response;

    @PutMapping("/stripe/success")
    public ResponseEntity<?> stripeSuccess(
            @RequestParam("session_id") String paymentLinkId,
            @RequestParam String order_id
    ) throws StripeException {

        log.info("Stripe success callback received for payment: {}", paymentLinkId);
        boolean isPaymentVerified = paymentService.verifyStripePayment(paymentLinkId);
        if (isPaymentVerified) {
            paymentService.updatePaymentOrderStatus(paymentLinkId, true, order_id);
            log.info("Stripe payment verified and updated successfully: {}", paymentLinkId);

            return response.createBuildResponseMessage(
                    "Payment successful! Your order is confirmed.",
                    HttpStatus.OK
            );
        } else {
            log.warn("Stripe payment verification failed: {}", paymentLinkId);
            return response.createErrorResponseMessage(
                    "Payment verification failed. Please contact support.",
                    HttpStatus.BAD_REQUEST
            );
        }
    }


    @PutMapping("/stripe/cancel")
    public ResponseEntity<?> stripeCancel(
            @RequestParam("session_id") String paymentLinkId,
            @RequestParam String order_id
    ) {

        log.info("Stripe cancel callback received for payment: {}", paymentLinkId);

        // Update status to failed (cancelled by user)
        paymentService.updatePaymentOrderStatus(paymentLinkId, false, order_id);

        return response.createErrorResponseMessage(
                "Payment was cancelled. You can try again if you wish.",
                HttpStatus.OK
        );
    }

//    /**
//     * JAZZCASH CALLBACK (if needed for async notifications)
//     * JazzCash might call this if they support webhook notifications
//     */
//    @PostMapping("/jazzcash/callback")
//    public ResponseEntity<?> jazzCashCallback(
//            @RequestParam(value = "pp_ResponseCode", required = false) String responseCode,
//            @RequestParam(value = "pp_TxnRefNo", required = false) String transactionRefNo,
//            @RequestParam(value = "pp_Amount", required = false) String amount,
//            @RequestParam(value = "pp_orderId") String orderId
//    ) {
//
//        try {
//            log.info("JazzCash callback received. Ref: {}, Code: {}", transactionRefNo, responseCode);
//
//            if ("000".equals(responseCode)) {
//                // JazzCash payment succeeded
//                paymentService.updatePaymentOrderStatus(transactionRefNo, true, orderId);
//                return ResponseEntity.ok("OK"); // JazzCash expects simple "OK"
//            } else {
//                // JazzCash payment failed
//                paymentService.updatePaymentOrderStatus(transactionRefNo, false, orderId);
//                return ResponseEntity.ok("OK"); // Still return OK to acknowledge receipt
//            }
//
//        } catch (Exception e) {
//            log.error("Error processing JazzCash callback", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR");
//        }
//    }

    /**
     * MANUAL PAYMENT VERIFICATION ENDPOINT
     * Frontend can call this if they want to verify payment status
     */
    @GetMapping("/verify/{paymentId}")
    public ResponseEntity<?> verifyPayment(@PathVariable String paymentId) {
        try {
            log.info("Manual payment verification requested: {}", paymentId);

            if (paymentId.startsWith("cs_")) {
                // Stripe payment verification
                boolean isVerified = paymentService.verifyStripePayment(paymentId);
                return response.createBuildResponseMessage(
                        isVerified ? "Payment verified successfully" : "Payment verification failed",
                        isVerified ? HttpStatus.OK : HttpStatus.BAD_REQUEST
                );
            } else {
                // JazzCash payment - check status in database
                boolean paymentExists = paymentService.validatePayment(paymentId, null);
                return response.createBuildResponseMessage(
                        paymentExists ? "Payment record found" : "Payment record not found",
                        paymentExists ? HttpStatus.OK : HttpStatus.NOT_FOUND
                );
            }

        } catch (Exception e) {
            log.error("Manual payment verification failed: {}", paymentId, e);
            return response.createErrorResponseMessage(
                    "Payment verification failed",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}