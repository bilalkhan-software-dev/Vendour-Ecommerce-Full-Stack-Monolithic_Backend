package com.vendor_marketplace.services.Impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.vendor_marketplace.config.StripeConfig;
import com.vendor_marketplace.dto.response.JazzCashPaymentResponse;
import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.dto.response.StripePaymentInitiationResponse;
import com.vendor_marketplace.dto.response.PaymentOrderResponse;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.exception.SameStatusUpdateException;
import com.vendor_marketplace.mapper.OrderMapper;
import com.vendor_marketplace.mapper.PaymentOrderMapper;
import com.vendor_marketplace.repository.*;
import com.vendor_marketplace.services.*;
import com.vendor_marketplace.entity.enums.OrderStatus;
import com.vendor_marketplace.entity.enums.PaymentMethod;
import com.vendor_marketplace.entity.enums.PaymentOrderStatus;
import com.vendor_marketplace.entity.enums.PaymentStatus;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.vendor_marketplace.utils.CommonUtil.convertPKRToDollar;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final SellerReportService sellerReportService;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final PaymentOrderRepository paymentOrderRepository;
    private final SellerReportRepository sellerReportRepository;
    private final StripeConfig stripeConfig;
    private final JazzCashService jazzCashService;
    private final ProductService productService;
    private final RedisUtil redisUtil;

    @Override
    @Transactional
    public PaymentOrderResponse createPaymentOrder(Set<Order> orders, User user) {
        long totalAmount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();

        if (totalAmount <= 0) {
            throw new IllegalArgumentException("Order amount must be greater than zero");
        }

        PaymentOrder paymentOrder = PaymentOrder.builder()
                .amount(totalAmount)
                .paymentOrderStatus(PaymentOrderStatus.PENDING)
                .paymentMethod(PaymentMethod.STRIPE)
                .user(user)
                .orders(orders)
                .build();

        PaymentOrder savedOrder = paymentOrderRepository.save(paymentOrder);
        log.info("Created payment order {} for amount: {}", savedOrder.getId(), totalAmount);

        return PaymentOrderMapper.toPaymentOrderResponse(savedOrder);
    }

    @Override
    public PaymentOrderResponse getPaymentOrderById(Long paymentOrderId) {
        PaymentOrder paymentOrder = paymentOrderRepository.findById(paymentOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentOrder not found: " + paymentOrderId));

        return PaymentOrderMapper.toPaymentOrderResponse(paymentOrder);
    }

    @Override
    public PaymentOrderResponse getPaymentOrderByPaymentLinkId(String paymentLinkId) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment linkId not found: " + paymentLinkId));

        return PaymentOrderMapper.toPaymentOrderResponse(paymentOrder);
    }

    @Override
    @Transactional
    public StripePaymentInitiationResponse initiateStripePayment(Set<Order> orders, User user, String orderId) throws StripeException {
        long totalAmount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();

        if (totalAmount <= 0) {
            throw new IllegalArgumentException("Order amount must be greater than zero");
        }

        if (totalAmount * 100 < 50) {
            throw new IllegalArgumentException("Order amount is below Stripe's minimum requirement");
        }

        PaymentOrder paymentOrder = PaymentOrder.builder()
                .amount(totalAmount)
                .paymentOrderStatus(PaymentOrderStatus.PENDING)
                .paymentMethod(PaymentMethod.STRIPE)
                .user(user)
                .orders(orders)
                .build();

        long convertedPKRToDollar = convertPKRToDollar(totalAmount);

        Stripe.apiKey = stripeConfig.getSecretKey();

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(stripeConfig.getSuccessUrl() + "?session_id={CHECKOUT_SESSION_ID}&order_id=" + orderId)
                .setCancelUrl(stripeConfig.getCancelUrl() + "?session_id={CHECKOUT_SESSION_ID}&order_id=" + orderId)
                .setCustomerEmail(user.getEmail())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(stripeConfig.getCurrency().toLowerCase())
                                                .setUnitAmount(convertedPKRToDollar)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Order #" + orderId)
                                                                .setDescription("Vendor Marketplace Order")
                                                                .build()
                                                ).build()
                                ).build())
                .putMetadata("order_id", orderId)
                .putMetadata("user_id", user.getId().toString())
//                .putMetadata("total_sellers", String.valueOf(orders.stream().mapToLong(order -> order.getSellerId()).sum()))
                .putMetadata("user_email", user.getEmail())
                .build();

        Session session = Session.create(params);

        paymentOrder.setPaymentLinkId(session.getId());
        paymentOrderRepository.save(paymentOrder);

        for (Order order : orders) {
            order.getPaymentDetails().setStripePaymentLinkId(session.getId());
            order.getPaymentDetails().setAmount(totalAmount);
            order.getPaymentDetails().setPaymentStatus(PaymentStatus.PENDING);
            order.getPaymentDetails().setPaymentMethod(PaymentMethod.STRIPE);
            orderRepository.save(order);
        }

        log.info("Stripe payment session created: {} for order: {}", session.getId(), orderId);

        return StripePaymentInitiationResponse.builder()
                .paymentId(session.getId())
                .paymentUrl(session.getUrl())
                .amount(totalAmount)
                .currency(stripeConfig.getCurrency())
                .success(true)
                .message("Stripe payment session created successfully")
                .orders(orders.stream().map(OrderMapper::toOrderResponse).collect(Collectors.toSet()))
                .build();
    }

    @Override
    @Transactional
    public Boolean proceedJazzCashPayment(Set<Order> orders, User user, String orderId, String mobileNo) {
        long totalAmount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();

        if (totalAmount <= 0) {
            throw new IllegalArgumentException("Order amount must be greater than zero");
        }

        PaymentOrder paymentOrder = PaymentOrder.builder()
                .amount(totalAmount)
                .paymentOrderStatus(PaymentOrderStatus.PENDING)
                .paymentMethod(PaymentMethod.JAZZCASH)
                .user(user)
                .orders(orders)
                .build();

        Map<String, String> jazzCashRequest = jazzCashService.createJazzCashRequest(orderId, totalAmount, mobileNo);
        String transactionReferenceNumber = jazzCashService.getTransactionReference(jazzCashRequest);

        paymentOrder.setPaymentLinkId(transactionReferenceNumber);
        paymentOrderRepository.save(paymentOrder);

        for (Order order : orders) {
            order.getPaymentDetails().setJazzCashTransactionSecureHash(jazzCashRequest.get("pp_SecureHash"));
            order.getPaymentDetails().setJazzCashTransactionReferenceNumber(transactionReferenceNumber);
            order.getPaymentDetails().setAmount(totalAmount);
            order.getPaymentDetails().setPaymentStatus(PaymentStatus.PROCESSING);
            order.getPaymentDetails().setPaymentMethod(PaymentMethod.JAZZCASH);
            orderRepository.save(order);
        }

        log.info("Sending JazzCash payment request for transaction: {}", transactionReferenceNumber);

        JazzCashPaymentResponse jazzCashPaymentResponse = jazzCashService.sendPaymentRequestToJazzCash(jazzCashRequest);

        boolean isSuccess = jazzCashService.validateJazzCashResponse(jazzCashPaymentResponse, totalAmount);


        updatePaymentOrderStatus(transactionReferenceNumber, isSuccess, orderId);

        return isSuccess;
    }

    @Override
    @Transactional
    public boolean verifyStripePayment(String sessionId) throws StripeException {
        Stripe.apiKey = stripeConfig.getSecretKey();

        Session session = Session.retrieve(sessionId);

        if ("paid".equals(session.getPaymentStatus())) {
            log.info("Stripe payment verified successfully. Session: {}", sessionId);
            return true;
        }

        log.warn("Stripe payment not completed. Session: {}, Status: {}",
                sessionId, session.getPaymentStatus());
        return false;
    }

    @Override
    public boolean validatePayment(String paymentId, String paymentUrl) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            return false;
        }

        if (paymentId.startsWith("cs_")) {
            try {
                Stripe.apiKey = stripeConfig.getSecretKey();
                Session session = Session.retrieve(paymentId);
                return session != null && ("open".equals(session.getStatus()) || "complete".equals(session.getStatus()));
            } catch (StripeException e) {
                log.warn("Stripe validation failed for: {}", paymentId, e);
                return false;
            }
        }

        return paymentOrderRepository.findByPaymentLinkId(paymentId).isPresent();
    }

    @Override
    @Transactional
    public void updatePaymentOrderStatus(String paymentLinkId, boolean success, String orderId) {

        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "PaymentOrder not found with linkId: " + paymentLinkId));

        if (paymentOrder.getPaymentOrderStatus() == PaymentOrderStatus.SUCCESS) {
            log.warn("Duplicate payment confirmation ignored for linkId: {}", paymentLinkId);
            return;
        }

        paymentOrder.setPaymentOrderStatus(success ? PaymentOrderStatus.SUCCESS : PaymentOrderStatus.FAILED);
        paymentOrderRepository.save(paymentOrder);

        List<Order> ordersToSave = new ArrayList<>();

        // Get ALL orders with the same orderId (all sellers)
        List<Order> allOrdersWithSameId = paymentOrder.getOrders().stream()
                .filter(order -> orderId == null || order.getOrderId().equals(orderId))
                .collect(Collectors.toList());


        for (Order order : allOrdersWithSameId) {
            order.setOrderStatus(success ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED);
            order.setPaymentStatus(success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);

            if (order.getPaymentDetails() != null) {
                order.getPaymentDetails().setPaymentStatus(success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
            }

            if (!success) {
                String userOrderCacheKey = RedisUtil.userOrders(order.getUser().getId());
                redisUtil.deleteFromRedis(userOrderCacheKey);
                String sellerOrderCacheKey = RedisUtil.sellerOrders(order.getSellerId());
                redisUtil.deleteFromRedis(sellerOrderCacheKey);
            }


            if (success) {
                handleSuccessfulOrder(order);

                // Clear cart items for this specific order's items
                cartRepository.findById(order.getCartId())
                        .ifPresent(cart -> {
                            // Only remove items that belong to this seller's order
                            List<CartItem> itemsToRemove = cart.getCartItems().stream()
                                    .filter(item -> item.getProduct().getSeller().getId().equals(order.getSellerId()))
                                    .collect(Collectors.toList());

                            cart.getCartItems().removeAll(itemsToRemove);
                            cartRepository.save(cart);
                            log.info("Updating Product Stocks");
                            // Update inventory for removed items
                            itemsToRemove.forEach(item ->
                                    productService.updateInventory(item.getProduct().getId(), item.getQuantity())
                            );
                            log.info("Reset Cart Coupon code to empty");
                            if (cart.getCartItems().isEmpty() && cart.getCouponCode() != null) {
                                resetCartToEmpty(cart);
                                cartRepository.save(cart);
                            }
                        });
                // Clearing cache for data consistency
                clearOrderCartCache(order.getUser().getId(),order.getSellerId());
            }
            ordersToSave.add(order);
        }


        orderRepository.saveAll(ordersToSave);

        log.info("Updated payment order status: {} for linkId: {}; Orders updated: {}",
                success ? "COMPLETED" : "FAILED",
                paymentLinkId,
                allOrdersWithSameId.stream().map(Order::getOrderId).distinct().toList());
    }

    private void resetCartToEmpty(Cart cart) {


        cart.setTotalItems(0);
        cart.setTotalMrpPrice(0);
        cart.setTotalSellingPrice(0);
        cart.setDiscount(0);

        // coupon-related fields
        cart.setCouponCode(null);
        cart.setCouponDiscountAmount(null);
        cart.setOriginalSellingPrice(null);
        cart.setOriginalMrpPrice(null);
    }

    private void handleSuccessfulOrder(Order order) {
        // Check if transaction already exists for THIS specific seller order
        boolean transactionExists = transactionRepository.existsByOrder_Id(order.getId());
        if (!transactionExists) {
            // Create transaction for this seller
            transactionService.createTransaction(order);

            // Update SellerReport for THIS seller
            updateSellerReport(order);

            log.info("Created transaction and updated report for seller: {} | order: {}",
                    order.getSellerId(), order.getId());
        } else {
            log.warn("Transaction already exists for order: {} and seller: {}",
                    order.getId(), order.getSellerId());
            throw new SameStatusUpdateException("Payment is already verified for seller: " + order.getSellerId());
        }
    }

    private void updateSellerReport(Order order) {
        SellerReport sellerReport = sellerReportService.getSellerReportBySellerId(order.getSellerId());

        // Initialize if null
        if (sellerReport.getTotalOrders() == null) sellerReport.setTotalOrders(0);
        if (sellerReport.getTotalSales() == null) sellerReport.setTotalSales(0L);
        if (sellerReport.getTotalEarnings() == null) sellerReport.setTotalEarnings(0L);
        if (sellerReport.getTotalRefunds() == null) sellerReport.setTotalRefunds(0L);
        if (sellerReport.getTotalTax() == null) sellerReport.setTotalTax(0L);
        if (sellerReport.getTotalTransactions() == null) sellerReport.setTotalTransactions(0);

        // Update report for this seller
        sellerReport.setTotalOrders(sellerReport.getTotalOrders() + 1);
        sellerReport.setTotalTransactions(sellerReport.getTotalTransactions() + 1);
        sellerReport.setTotalSales(sellerReport.getTotalSales() + order.getTotalSellingPrice());
        sellerReport.setTotalEarnings(sellerReport.getTotalEarnings() + order.getTotalSellingPrice());

        // Calculate net earnings
        long netEarnings = sellerReport.getTotalEarnings() -
                (sellerReport.getTotalRefunds() + sellerReport.getTotalTax());
        sellerReport.setNetEarnings(netEarnings);

        sellerReportRepository.save(sellerReport);

        log.info("Updated seller report for seller: {} | new total orders: {} | new total sales: {}",
                order.getSellerId(), sellerReport.getTotalOrders(), sellerReport.getTotalSales());
    }


    private void clearOrderCartCache(long userId, long sellerId){
        String userCart = RedisUtil.userCart(userId);
        redisUtil.deleteFromRedis(userCart);
        String userOrderCacheKey = RedisUtil.userOrders(userId);
        redisUtil.deleteFromRedis(userOrderCacheKey);
        String sellerOrderCacheKey = RedisUtil.sellerOrders(sellerId);
        redisUtil.deleteFromRedis(sellerOrderCacheKey);

    }
}