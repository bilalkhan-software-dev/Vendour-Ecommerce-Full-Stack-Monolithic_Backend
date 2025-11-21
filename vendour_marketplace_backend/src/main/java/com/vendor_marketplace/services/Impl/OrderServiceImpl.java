package com.vendor_marketplace.services.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.stripe.exception.StripeException;
import com.vendor_marketplace.dto.request.ShippingAddressRequest;
import com.vendor_marketplace.dto.response.OrderItemResponse;
import com.vendor_marketplace.dto.response.OrderResponse;
import com.vendor_marketplace.dto.response.StripePaymentInitiationResponse;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.exception.SameStatusUpdateException;
import com.vendor_marketplace.mapper.OrderItemMapper;
import com.vendor_marketplace.mapper.OrderMapper;
import com.vendor_marketplace.repository.*;
import com.vendor_marketplace.services.*;
import com.vendor_marketplace.utils.RandomUtil;
import com.vendor_marketplace.entity.enums.OrderStatus;
import com.vendor_marketplace.entity.enums.PaymentMethod;
import com.vendor_marketplace.entity.enums.PaymentStatus;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.vendor_marketplace.utils.CommonUtil.calculateDiscountPercentage;


@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final SellerRepository sellerRepository;
    private final SellerReportRepository sellerReportRepository;
    private final PaymentService paymentService;
    private final RedisUtil redisUtil;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public StripePaymentInitiationResponse placeOrderForStripeRedirectBasedUrl(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod) throws StripeException {

        if (paymentMethod.equals(PaymentMethod.CASH_ON_DELIVERY)) {
            throw new IllegalArgumentException("Implementing Soon!");
        }
        if (!(paymentMethod.equals(PaymentMethod.STRIPE))) {
            throw new IllegalArgumentException("Invalid PaymentMethod. This only process Stripe payment method");
        }

        User user = userService.getUserFromJwt(jwt);
        Set<Order> orders = createOrders(user, addressRequest);

        redisUtil.evictOrderCaches(orders);

        String orderId = orders.stream()
                .reduce((first, second) -> second) // get last
                .map(Order::getOrderId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Something went wrong when creating order")
                );
        return paymentService.initiateStripePayment(orders, user, orderId);
    }

    @Override
    @Transactional
    public Boolean placeOrderUsingJazzcashApi(String jwt, ShippingAddressRequest addressRequest, PaymentMethod paymentMethod, String jazzCashAccountMobileNo) {

        if (paymentMethod.equals(PaymentMethod.CASH_ON_DELIVERY)) {
            throw new IllegalArgumentException("Implementing Soon!");
        }
        if (!(paymentMethod.equals(PaymentMethod.JAZZCASH))) {
            throw new IllegalArgumentException("Invalid PaymentMethod. This only process JazzCash payment method");
        }

        User user = userService.getUserFromJwt(jwt);
        Set<Order> orders = createOrders(user, addressRequest);

        redisUtil.evictOrderCaches(orders);

        String orderId = orders.stream()
                .reduce((first, second) -> second) // get last
                .map(Order::getOrderId)
                .orElseThrow();
        return paymentService.proceedJazzCashPayment(orders, user, orderId, jazzCashAccountMobileNo);
    }


    @Override
    public List<OrderResponse> userOrders(String jwt) {
        User user = userService.getUserFromJwt(jwt);
        String cacheKey = RedisUtil.userOrders(user.getId());

        List<OrderResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<OrderResponse>>() {
        });
        if (cachedResponse != null && !cachedResponse.isEmpty()) {
            return cachedResponse;
        }

        List<OrderResponse> orders = orderRepository.findByUser_id(user.getId())
                .stream()
                .map(OrderMapper::toOrderResponse)
                .collect(Collectors.toList());

        redisUtil.saveToRedis(cacheKey, orders, RedisUtil.ONE_HOUR_CACHE_TTL);
        return orders;
    }


    @Override
    public List<OrderResponse> sellerOrders(String jwt) {

        Seller seller = sellerService.getSellerFromJwt(jwt);

        String cacheKey = RedisUtil.sellerOrders(seller.getId());
        List<OrderResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<List<OrderResponse>>() {
        });
        if (cachedResponse != null && !cachedResponse.isEmpty()) {
            return cachedResponse;
        }


        List<Order> sellerOrder = orderRepository.findBySellerId(seller.getId());
        List<OrderResponse> responses = sellerOrder.stream().map(OrderMapper::toOrderResponse).collect(Collectors.toList());
        redisUtil.saveToRedis(cacheKey, responses, RedisUtil.ONE_HOUR_CACHE_TTL);

        return responses;
    }

    // only updated by seller
    @Override
    public OrderResponse updateOrderStatus(String jwt, Long orderId, OrderStatus orderStatus) {

        Seller seller = sellerService.getSellerFromJwt(jwt);
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order not found with id: " + orderId)
        );
        if (order.getOrderStatus().equals(orderStatus)) {
            throw new SameStatusUpdateException("You are updating same status. Try different status to make changes");
        }

        if (!order.getSellerId().equals(seller.getId())) {
            throw new IllegalArgumentException("You can't update another seller orders");
        }

        order.setOrderStatus(orderStatus);
        Order updatedOrder = orderRepository.save(order);

        OrderResponse updatedResponse = OrderMapper.toOrderResponse(updatedOrder);

        // cache related
        String cacheKey = RedisUtil.order(orderId);
        redisUtil.saveToRedis(cacheKey, updatedResponse, RedisUtil.ONE_DAY_CACHE_TTL);

        Long userId = order.getUser().getId();
        Long sellerId = seller.getId();
        redisUtil.deleteUserAndSellerOrdersCache(userId, sellerId);

        return updatedResponse;
    }


    // for customer <-> user to cancel order
    @Override
    @Transactional
    public OrderResponse cancelOrder(String jwt, Long orderId) {

        User user = userService.getUserFromJwt(jwt);
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order not found with id: " + orderId)
        );

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You don't have access this order id");
        }

        if (order.getOrderStatus().equals(OrderStatus.CANCELLED)) {
            throw new SameStatusUpdateException("Order Already Cancelled. Your amount will be refund soon!");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.REFUND_REQUEST);
        order.getPaymentDetails().setPaymentStatus(PaymentStatus.REFUND_REQUEST);

        // Using here if seller is not found then we don't need to place order if seller is not found
        Long sellerId = order.getSellerId();
        sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found in your order")
        );
        Order savedOrder = orderRepository.save(order);


        // User cancel the order then updating the seller report
        SellerReport report = sellerReportRepository.findBySellerId(sellerId);
        report.setCancelOrders(report.getCancelOrders() + 1);
        report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());
        sellerReportService.updateSellerReport(report);

        OrderResponse updatedResponse = OrderMapper.toOrderResponse(savedOrder);

        // cache related
        String cacheKey = RedisUtil.order(orderId);
        redisUtil.saveToRedis(cacheKey, updatedResponse, RedisUtil.ONE_DAY_CACHE_TTL);

        Long userId = user.getId();
        redisUtil.deleteUserAndSellerOrdersCache(userId, sellerId);

        return updatedResponse;

    }

    @Override
    public OrderResponse findOrderById(Long orderId) {

        String cacheKey = RedisUtil.order(orderId);

        // try fetching from redis
        OrderResponse cachedResponse = redisUtil.get(cacheKey, OrderResponse.class);

        if (cachedResponse != null) {
            return cachedResponse;
        }


        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order not found with id: " + orderId)
        );

        OrderResponse response = OrderMapper.toOrderResponse(order);

        // set cache
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);

        return response;
    }

    @Override
    public OrderItemResponse getOrderItemById(Long orderItemId) {
        String cacheKey = RedisUtil.orderItem(orderItemId);

        OrderItemResponse cachedResponse = redisUtil.get(cacheKey, OrderItemResponse.class);
        if (cachedResponse != null) {
            return cachedResponse;
        }


        OrderItemResponse orderItemResponse = OrderItemMapper.toOrderItemResponse(orderItemRepository.findById(orderItemId).orElseThrow(
                () -> new ResourceNotFoundException("OrderItem not found with id: " + orderItemId)
        ));

        redisUtil.saveToRedis(cacheKey, orderItemResponse, RedisUtil.ONE_DAY_CACHE_TTL);


        return orderItemResponse;
    }


    private Address mapToEntity(ShippingAddressRequest addressRequest) {
        return Address.builder()
                .mobile(addressRequest.getMobile())
                .city(addressRequest.getCity())
                .locality(addressRequest.getLocality())
                .pinCode(addressRequest.getPinCode())
                .name(addressRequest.getName())
                .state(addressRequest.getState())
                .address(addressRequest.getAddress())
                .build();
    }


    private Set<Order> createOrders(User user, ShippingAddressRequest addressRequest) {
        log.info("Starting order creation for userId={} | email={}", user.getId(), user.getEmail());

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user " + user.getId()));
        log.info("Cart retrieved successfully | cartId={} | totalItems={} | couponApplied={}",
                cart.getId(), cart.getCartItems().size(), cart.getCouponCode());

        // Save or reuse address
        Address savedAddress = saveOrReuseAddress(user, addressRequest);

        // Group cart items by seller
        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));
        log.info("Grouped cart items by seller | totalSellers={}", itemsBySeller.size());

        Set<Order> orders = new HashSet<>();
        String randomOrderId = RandomUtil.toGenerateOrderId();

        // Calculate coupon distribution if coupon is applied
        boolean hasCoupon = cart.getCouponCode() != null && !cart.getCouponCode().isEmpty();
        int totalCouponDiscount = hasCoupon ? cart.getCouponDiscountAmount() : 0;
        int cartTotalSellingBeforeCoupon = hasCoupon ?
                (cart.getOriginalSellingPrice() != null ? cart.getOriginalSellingPrice() : calculateBaseSellingPrice(cart))
                : (int) cart.getTotalSellingPrice();

        log.info("Coupon details | hasCoupon={} | couponCode={} | totalCouponDiscount={} | cartTotalSellingBeforeCoupon={}",
                hasCoupon, cart.getCouponCode(), totalCouponDiscount, cartTotalSellingBeforeCoupon);

        // Iterate over each seller's items
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();
            log.info("Creating order for sellerId={} | totalItems={}", sellerId, items.size());

            // Validate stocks
            validateStocks(items);
            log.info("Validated Stocks");

            // Calculate seller's base totals (without coupon)
            int sellerMrpPrice = items.stream().mapToInt(CartItem::getMrpPrice).sum();
            int sellerSellingPriceBeforeCoupon = items.stream().mapToInt(CartItem::getSellingPrice).sum();
            int sellerTotalQuantity = items.stream().mapToInt(CartItem::getQuantity).sum();

            // Apply proportional coupon discount to this seller
            int sellerCouponDiscount = 0;
            int sellerFinalSellingPrice = sellerSellingPriceBeforeCoupon;

            if (hasCoupon && totalCouponDiscount > 0 && cartTotalSellingBeforeCoupon > 0) {
                // Calculate seller's share of the coupon discount proportionally
                double sellerShare = (double) sellerSellingPriceBeforeCoupon / cartTotalSellingBeforeCoupon;
                sellerCouponDiscount = (int) Math.round(totalCouponDiscount * sellerShare);
                sellerFinalSellingPrice = sellerSellingPriceBeforeCoupon - sellerCouponDiscount;

                // Ensure price doesn't go negative
                sellerFinalSellingPrice = Math.max(0, sellerFinalSellingPrice);

                log.debug("Coupon distribution for sellerId={} | share={}% | discount={} | finalPrice={}",
                        sellerId, Math.round(sellerShare * 100), sellerCouponDiscount, sellerFinalSellingPrice);
            }

            int discount = calculateDiscountPercentage(sellerMrpPrice, sellerFinalSellingPrice);

            log.debug("Price summary for sellerId={} | baseMRP={} | baseSelling={} | couponDiscount={} | finalSelling={} | discount={}%",
                    sellerId, sellerMrpPrice, sellerSellingPriceBeforeCoupon, sellerCouponDiscount,
                    sellerFinalSellingPrice, discount);

            // Create order entity with coupon details
            Order createdOrder = Order.builder()
                    .user(user)
                    .cartId(cart.getId())
                    .orderId(randomOrderId)
                    .sellerId(sellerId)
                    .totalMrpPrice(sellerMrpPrice)
                    .totalSellingPrice(sellerFinalSellingPrice) // Includes coupon discount
                    .totalItems(sellerTotalQuantity)
                    .discount(discount)
                    .shippingAddress(savedAddress)
                    .orderStatus(OrderStatus.PLACED)
                    .paymentStatus(PaymentStatus.PENDING)
                    .couponCode(hasCoupon ? cart.getCouponCode() : null)
                    .couponDiscountAmount(hasCoupon ? sellerCouponDiscount : 0)
                    .originalSellingPrice(sellerSellingPriceBeforeCoupon) // Store original price before coupon
                    .build();

            // Add order items with individual coupon discounts
            for (CartItem item : items) {
                // Calculate item-level coupon discount proportionally
                int itemCouponDiscount = 0;
                if (hasCoupon && sellerCouponDiscount > 0 && sellerSellingPriceBeforeCoupon > 0) {
                    double itemShare = (double) item.getSellingPrice() / sellerSellingPriceBeforeCoupon;
                    itemCouponDiscount = (int) Math.round(sellerCouponDiscount * itemShare);
                }

                int itemFinalSellingPrice = item.getSellingPrice() - itemCouponDiscount;

                createdOrder.getOrderItems().add(OrderItem.builder()
                        .order(createdOrder)
                        .mrpPrice(item.getMrpPrice())
                        .quantity(item.getQuantity())
                        .size(item.getSize())
                        .product(item.getProduct())
                        .userId(item.getUserId())
                        .sellingPrice(itemFinalSellingPrice) // Final price after coupon
                        .originalSellingPrice(item.getSellingPrice()) // Original price before coupon
                        .couponDiscountAmount(itemCouponDiscount) // Individual item coupon discount
                        .build());
            }

            Order savedOrder = orderRepository.save(createdOrder);
            log.info("Order created successfully | orderId={} | sellerId={} | totalItems={} | finalPrice={} | couponDiscount={} | status={}",
                    savedOrder.getOrderId(), sellerId, savedOrder.getTotalItems(),
                    savedOrder.getTotalSellingPrice(), sellerCouponDiscount, savedOrder.getOrderStatus());

            orders.add(savedOrder);
        }

        log.info("All orders created successfully for userId={} | totalOrders={} | totalCouponDiscountApplied={}",
                user.getId(), orders.size(), totalCouponDiscount);


        return orders;
    }

    // Calculate base selling price from cart items (without coupon)
    private int calculateBaseSellingPrice(Cart cart) {
        return cart.getCartItems().stream()
                .mapToInt(CartItem::getSellingPrice)
                .sum();
    }

    private void validateStocks(List<CartItem> items) {
        items.stream()
                .filter(item -> item.getQuantity() > item.getProduct().getStocks())
                .findFirst()
                .ifPresent(item -> {
                    throw new IllegalArgumentException(
                            "Product '" + item.getProduct().getTitle() + "' quantity (" + item.getQuantity() +
                                    ") exceeds available stock (" + item.getProduct().getStocks() + ")"
                    );
                });
    }


    private Address saveOrReuseAddress(User user, ShippingAddressRequest addressRequest) {
        Address mappedAddress = mapToEntity(addressRequest);

        boolean addressExists = user.getAddress().stream()
                .anyMatch(addr -> Objects.equals(addr.getAddress(), mappedAddress.getAddress()) &&
                        Objects.equals(addr.getCity(), mappedAddress.getCity()) &&
                        Objects.equals(addr.getPinCode(), mappedAddress.getPinCode()) &&
                        Objects.equals(addr.getMobile(), mappedAddress.getMobile()));

        Address savedAddress;
        if (!addressExists) {
            user.getAddress().add(mappedAddress);
            savedAddress = addressRepository.save(mappedAddress);
            log.info("New shipping address saved | addressId={}", savedAddress.getId());
        } else {
            savedAddress = user.getAddress().stream()
                    .filter(addr -> Objects.equals(addr.getAddress(), mappedAddress.getAddress()) &&
                            Objects.equals(addr.getCity(), mappedAddress.getCity()) &&
                            Objects.equals(addr.getPinCode(), mappedAddress.getPinCode()) &&
                            Objects.equals(addr.getMobile(), mappedAddress.getMobile()))
                    .findFirst()
                    .orElse(mappedAddress);
            log.info("Using existing address | addressId={}", savedAddress.getId());
        }

        userRepository.save(user);
        return savedAddress;
    }


}
