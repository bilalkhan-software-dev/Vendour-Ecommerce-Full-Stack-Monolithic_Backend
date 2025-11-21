package com.vendor_marketplace.services;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.dto.response.StripePaymentInitiationResponse;
import com.vendor_marketplace.dto.response.PaymentOrderResponse;
import com.vendor_marketplace.entity.Order;
import com.vendor_marketplace.entity.User;

import java.util.Set;

public interface PaymentService {

    /**
     * STRIPE PAYMENT - PART 1: CREATE PAYMENT LINK
     * <p>
     * What this does: Creates a Stripe payment page for the customer
     * <p>
     * How it works:
     * 1. Customer chooses Stripe payment
     * 2. We create a special Stripe payment link
     * 3. We save this link in our database
     * 4. We return the link to the customer's browser
     * 5. Customer gets redirected to Stripe to pay
     *
     * @param orders  - What the customer is buying
     * @param user    - Who is making the payment
     * @param orderId - Unique order number
     * @return Payment link and ID for tracking
     */
    StripePaymentInitiationResponse initiateStripePayment(Set<Order> orders, User user, String orderId) throws StripeException;

    /**
     * STRIPE PAYMENT - PART 2: CHECK IF PAYMENT WAS SUCCESSFUL
     * <p>
     * What this does: Checks if customer actually paid on Stripe
     * <p>
     * How it works:
     * 1. After paying, customer comes back to our website
     * 2. We ask Stripe: "Did this customer pay?"
     * 3. Stripe says: "Yes, they paid" or "No, they didn't"
     * 4. We update our records accordingly
     *
     * @param sessionId - The unique ID we got when creating the payment link
     * @return true if paid, false if not paid
     */
    boolean verifyStripePayment(String sessionId) throws StripeException;

    /**
     * JAZZCASH PAYMENT - PROCESS PAYMENT
     * <p>
     * What this does: Processes JazzCash payment directly
     * <p>
     * How it works:
     * 1. Customer enters JazzCash mobile number (like 923001234567)
     * 2. We send payment request to JazzCash
     * 3. JazzCash sends verification to customer's phone
     * 4. Customer approves payment via JazzCash app
     * 5. JazzCash tells us immediately if payment worked
     * 6. We update our records
     * <p>
     * Special Note: JazzCash uses special security codes to prevent fraud
     *
     * @param orders   - What the customer is buying
     * @param user     - Who is making the payment
     * @param orderId  - Unique order number
     * @param mobileNo - Customer's JazzCash mobile number
     * @return true if payment worked, false if it failed
     */
    Boolean proceedJazzCashPayment(Set<Order> orders, User user, String orderId, String mobileNo);

    /**
     * CREATE PAYMENT RECORD
     * <p>
     * What this does: Creates a record that payment is happening
     * <p>
     * Why we need it: To keep track of who is paying for what
     *
     * @param orders - The items being paid for
     * @param user   - The person paying
     * @return The payment record details
     */
    PaymentOrderResponse createPaymentOrder(Set<Order> orders, User user);

    /**
     * FIND PAYMENT BY ID
     * <p>
     * What this does: Finds a payment record using its number
     *
     * @param paymentOrderId - The payment record number
     * @return The payment details
     */
    PaymentOrderResponse getPaymentOrderById(Long paymentOrderId);

    /**
     * FIND PAYMENT BY LINK ID
     * <p>
     * What this does: Finds payment using Stripe or JazzCash reference number
     *
     * @param paymentLinkId - Stripe session ID or JazzCash transaction number
     * @return The payment details
     */
    PaymentOrderResponse getPaymentOrderByPaymentLinkId(String paymentLinkId);

    /**
     * CHECK IF PAYMENT ID IS VALID
     * <p>
     * What this does: Makes sure the payment ID looks correct
     * <p>
     * Why we need it: To prevent errors with wrong payment IDs
     *
     * @param paymentId  - The payment ID to check
     * @param paymentUrl - The payment URL (if available)
     * @return true if valid, false if invalid
     */
    boolean validatePayment(String paymentId, String paymentUrl);

    /**
     * UPDATE PAYMENT STATUS
     * <p>
     * What this does: Marks payment as successful or failed
     * <p>
     * How it works:
     * 1. After knowing payment result, we update our records
     * 2. If paid → mark as COMPLETED
     * 3. If failed → mark as FAILED
     * 4. Also update all related orders
     *
     * @param paymentId - Which payment to update
     * @param success   - true if paid, false if failed
     */
    void updatePaymentOrderStatus(String paymentId, boolean success,String orderId);
}

/*
 * ============================================================
 *   COMPLETE PAYMENT FLOW - SIMPLE EXPLANATION
 * ============================================================
 *
 * WHEN CUSTOMER ORDERS:
 * - We create order with status "PENDING" (waiting for payment)
 *
 *
 *   OPTION 1: STRIPE PAYMENT (Like shopping on Amazon)
 *
 * Step 1: Customer chooses Stripe
 * Step 2: We create Stripe payment page → initiateStripePayment()
 * Step 3: Customer goes to Stripe, enters card details, pays
 * Step 4: Customer comes back to our website
 * Step 5: We check with Stripe: "Did they pay?" → verifyStripePayment()
 * Step 6: If paid → mark order as "PAID", if failed → "FAILED"
 *
 *
 *   OPTION 2: JAZZCASH PAYMENT (Like EasyPaisa/JazzCash app)
 *
 * Step 1: Customer chooses JazzCash
 * Step 2: Customer enters mobile number (like 923001234567)
 * Step 3: We send payment request to JazzCash → proceedJazzCashPayment()
 * Step 4: JazzCash sends verification to customer's phone
 * Step 5: Customer approves payment in JazzCash app
 * Step 6: JazzCash immediately tells us if payment worked
 * Step 7: If payment code is "000" → success, mark as "PAID"
 *         If any other code → failed, mark as "FAILED"
 *
 *
 *   SECURITY NOTE FOR JAZZCASH:
 * - We use special security codes (hash) so no one can tamper with payments
 * - We double-check that the amount paid matches what we requested
 * - This prevents fraud and keeps payments safe
 *
 *
 *   WHAT HAPPENS AFTER PAYMENT:
 * - Successful payment → order status becomes "CONFIRMED"
 * - Failed payment → order status becomes "CANCELLED"
 * - Customer gets notification about payment result
 * - Admin can see all payment records in system
 *
 *
 *   KEY DIFFERENCES:
 * - Stripe: Customer leaves our site to pay, we check later if they paid
 * - JazzCash: Customer stays on our site, we get immediate answer
 * - Both are secure and widely used payment methods
 */