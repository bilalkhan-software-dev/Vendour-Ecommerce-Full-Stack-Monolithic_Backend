//package com.vendor_marketplace.initializer;
//
//import com.vendor_marketplace.entity.*;
//import com.vendor_marketplace.entity.enums.*;
//import com.vendor_marketplace.repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Set;
//
//import static com.vendor_marketplace.entity.enums.USER_ROLE.*;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final SellerRepository sellerRepository;
//    private final ProductRepository productRepository;
//    private final CartRepository cartRepository;
//    private final AddressRepository addressRepository;
//    private final OrderRepository orderRepository;
//    private final PaymentOrderRepository paymentOrderRepository;
//    private final WishlistRepository wishlistRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Value("${admin.info.name}")
//    private String adminName;
//
//    @Value("${admin.info.email}")
//    private String adminEmail;
//
//    @Value("${admin.info.mobile}")
//    private String adminMobile;
//
//    @Override
//    public void run(String... args) {
//        initAdmin();
//        Seller seller = initSeller();
//        User customer = initCustomer();
//        List<Product> products = initProducts(seller);
//        initWishlist(customer, products);
//        initCart(customer, products);
//        initOrders(customer, seller, products);
//    }
//
//    private void initAdmin() {
//        User admin = User.builder()
//                .role(ROLE_ADMIN)
//                .password(passwordEncoder.encode("password"))
//                .createdAt(LocalDateTime.now())
//                .fullName(adminName)
//                .email(adminEmail)
//                .mobile(adminMobile)
//                .build();
//
//        userRepository.findByEmail(admin.getEmail()).ifPresentOrElse(
//                u -> log.info("Admin already exists"),
//                () -> {
//                    log.info("Creating admin user");
//                    userRepository.save(admin);
//                }
//        );
//    }
//
//    private Seller initSeller() {
//        return sellerRepository.findByEmail("seller@demo.com").orElseGet(() -> {
//            log.info("Creating demo seller...");
//
//            Address pickup = Address.builder()
//                    .name("Demo Pickup Address")
//                    .locality("Commercial Market")
//                    .city("Lahore")
//                    .state("Punjab")
//                    .pinCode("54000")
//                    .mobile("03012345678")
//                    .address("Shop #12, Commercial Plaza, Lahore")
//                    .build();
//            addressRepository.save(pickup);
//
//            Seller seller = Seller.builder()
//                    .name("Demo Seller")
//                    .email("seller@demo.com")
//                    .mobile("03011223344")
//                    .password(passwordEncoder.encode("password"))
//                    .pickupAddress(pickup)
//                    .bankDetails(BankDetails.builder()
//                            .accountHolderName("Demo Seller")
//                            .accountNumber("1234567890123")
//                            .bankName("HBL")
//                            .IBAN("PK36HABB0000001234567890")
//                            .build())
//                    .businessDetails(BusinessDetails.builder()
//                            .businessName("Demo Electronics")
//                            .businessAddress("Lahore, Pakistan")
//                            .businessMobileNumber("03011223344")
//                            .businessEmail("seller@demo.com")
//                            .logo("https://res.cloudinary.com/demo/image/upload/v1700000000/logo.png")
//                            .banner("https://res.cloudinary.com/demo/image/upload/v1700000000/banner.png")
//                            .build())
//                    .accountStatus(AccountStatus.ACTIVE)
//                    .isEmailVerified(true)
//                    .build();
//
//            return sellerRepository.save(seller);
//        });
//    }
//
//    private User initCustomer() {
//        return userRepository.findByEmail("customer@demo.com").orElseGet(() -> {
//            log.info("Creating demo customer...");
//
//            Address shipping = Address.builder()
//                    .name("Demo Customer")
//                    .locality("Model Town")
//                    .city("Lahore")
//                    .state("Punjab")
//                    .pinCode("54000")
//                    .mobile("03019876543")
//                    .address("House #45, Model Town, Lahore")
//                    .build();
//            addressRepository.save(shipping);
//
//            User customer = User.builder()
//                    .role(ROLE_CUSTOMER)
//                    .fullName("Demo Customer")
//                    .email("customer@demo.com")
//                    .mobile("03019876543")
//                    .password(passwordEncoder.encode("password"))
//                    .createdAt(LocalDateTime.now())
//                    .address(Set.of(shipping))
//                    .build();
//
//            return userRepository.save(customer);
//        });
//    }
//
//    private List<Product> initProducts(Seller seller) {
//        if (!productRepository.findAll().isEmpty()) {
//            log.info("Products already exist");
//            return productRepository.findAll();
//        }
//
//        log.info("Seeding demo products...");
//
//        Product phone = Product.builder()
//                .title("Samsung Galaxy S24 Ultra")
//                .description("Latest Samsung flagship with Snapdragon 8 Gen 3")
//                .mrpPrice(350000)
//                .sellingPrice(320000)
//                .discountInPercentage(8.5)
//                .quantity(10)
//                .color("Black")
//                .images(List.of(
//                        "https://images.samsung.com/is/image/samsung/p6pim/pk/sm-s928bzkgmea/gallery/pk-galaxy-s24-ultra-black-1.jpg",
//                        "https://images.samsung.com/is/image/samsung/p6pim/pk/sm-s928bzkgmea/gallery/pk-galaxy-s24-ultra-black-2.jpg"
//                ))
//                .seller(seller)
//                .createdAt(LocalDateTime.now())
//                .sizes("Standard")
//                .build();
//
//        Product laptop = Product.builder()
//                .title("MacBook Pro 16 M3 Max")
//                .description("Apple MacBook Pro 16-inch with M3 Max chip")
//                .mrpPrice(850000)
//                .sellingPrice(799000)
//                .discountInPercentage(6.0)
//                .quantity(5)
//                .color("Space Gray")
//                .images(List.of(
//                        "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-m3-max-hero.jpg",
//                        "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-m3-max-side.jpg"
//                ))
//                .seller(seller)
//                .createdAt(LocalDateTime.now())
//                .sizes("16-inch")
//                .build();
//
//        return productRepository.saveAll(List.of(phone, laptop));
//    }
//
//    private void initWishlist(User customer, List<Product> products) {
//        if (wishlistRepository.findByUser(customer).isPresent()) {
//            return;
//        }
//        Wishlist wishlist = Wishlist.builder()
//                .user(customer)
//                .products(Set.copyOf(products))
//                .build();
//        wishlistRepository.save(wishlist);
//    }
//
//    private void initCart(User customer, List<Product> products) {
//        if (cartRepository.findByUserId(customer.getId()).isPresent()) {
//            return;
//        }
//        Cart cart = Cart.builder()
//                .user(customer)
//                .cartItems(Set.of(
//                        CartItem.builder()
//                                .product(products.get(0))
//                                .cart(null) // will be set after persist
//                                .quantity(1)
//                                .sellingPrice(products.get(0).getSellingPrice())
//                                .mrpPrice(products.get(0).getMrpPrice())
//                                .userId(customer.getId())
//                                .build()
//                ))
//                .totalItems(1)
//                .totalMrpPrice(products.get(0).getMrpPrice())
//                .totalSellingPrice(products.get(0).getSellingPrice())
//                .discount(products.get(0).getMrpPrice() - products.get(0).getSellingPrice())
//                .build();
//
//        cart.getCartItems().forEach(ci -> ci.setCart(cart));
//        cartRepository.save(cart);
//    }
//
//    private void initOrders(User customer, Seller seller, List<Product> products) {
//        if (!orderRepository.findAll().isEmpty()) {
//            log.info("Orders already exist");
//            return;
//        }
//
//        log.info("Creating demo JazzCash and Stripe orders...");
//
//        // JazzCash Order
//        PaymentOrder jazzcashPayment = PaymentOrder.builder()
//                .amount((long) products.get(0).getSellingPrice())
//                .paymentMethod(PaymentMethod.JAZZCASH)
//                .paymentLinkId("JC_TXN_123456789")
//                .paymentOrderStatus(PaymentOrderStatus.SUCCESS)
//                .user(customer)
//                .build();
//        paymentOrderRepository.save(jazzcashPayment);
//
//        Order jazzOrder = Order.builder()
//                .orderId("ORDER_JC_001")
//                .user(customer)
//                .sellerId(seller.getId())
//                .orderItems(List.of(
//                        OrderItem.builder()
//                                .product(products.get(0))
//                                .quantity(1)
//                                .mrpPrice(products.get(0).getMrpPrice())
//                                .sellingPrice(products.get(0).getSellingPrice())
//                                .userId(customer.getId())
//                                .build()
//                ))
//                .shippingAddress(customer.getAddress().iterator().next())
//                .totalMrpPrice(products.get(0).getMrpPrice())
//                .totalSellingPrice(products.get(0).getSellingPrice())
//                .totalItems(1)
//                .discount(products.get(0).getMrpPrice() - products.get(0).getSellingPrice())
//                .orderStatus(OrderStatus.CONFIRMED)
//                .paymentStatus(PaymentStatus.SUCCESS)
//                .paymentDetails(PaymentDetails.builder()
//                        .jazzCashTransactionReferenceNumber(jazzcashPayment.getPaymentLinkId())
//                        .paymentMethod(PaymentMethod.JAZZCASH)
//                        .paymentStatus(PaymentStatus.SUCCESS)
//                        .build())
//                .build();
//        orderRepository.save(jazzOrder);
//
//        // Stripe Order
//        PaymentOrder stripePayment = PaymentOrder.builder()
//                .amount((long) products.get(1).getSellingPrice())
//                .paymentMethod(PaymentMethod.STRIPE)
//                .paymentLinkId("STRIPE_TXN_987654321")
//                .paymentOrderStatus(PaymentOrderStatus.SUCCESS)
//                .user(customer)
//                .build();
//        paymentOrderRepository.save(stripePayment);
//
//        Order stripeOrder = Order.builder()
//                .orderId("ORDER_STRIPE_001")
//                .user(customer)
//                .sellerId(seller.getId())
//                .orderItems(List.of(
//                        OrderItem.builder()
//                                .product(products.get(1))
//                                .quantity(1)
//                                .mrpPrice(products.get(1).getMrpPrice())
//                                .sellingPrice(products.get(1).getSellingPrice())
//                                .userId(customer.getId())
//                                .build()
//                ))
//                .shippingAddress(customer.getAddress().iterator().next())
//                .totalMrpPrice(products.get(1).getMrpPrice())
//                .totalSellingPrice(products.get(1).getSellingPrice())
//                .totalItems(1)
//                .discount(products.get(1).getMrpPrice() - products.get(1).getSellingPrice())
//                .orderStatus(OrderStatus.CONFIRMED)
//                .paymentStatus(PaymentStatus.SUCCESS)
//                .paymentDetails(PaymentDetails.builder()
//                        .stripePaymentLinkId(stripePayment.getPaymentLinkId())
//                        .paymentMethod(PaymentMethod.STRIPE)
//                        .paymentStatus(PaymentStatus.SUCCESS)
//                        .build())
//                .build();
//        orderRepository.save(stripeOrder);
//    }
//}
