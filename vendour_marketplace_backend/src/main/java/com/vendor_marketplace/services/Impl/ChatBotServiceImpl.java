package com.vendor_marketplace.services.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vendor_marketplace.dto.request.ProductSeoRequest;
import com.vendor_marketplace.dto.response.*;
import com.vendor_marketplace.entity.Product;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.repository.OrderItemRepository;
import com.vendor_marketplace.repository.ProductRepository;
import com.vendor_marketplace.services.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.vendor_marketplace.utils.Constants.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatBotServiceImpl implements ChatBotService {

    private final ChatClient chatClient;
    private final UserService userService;
    private final ProductService productService;
    private final CartService cartService;
    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final ObjectMapper mapper = new ObjectMapper();


    @Override
    public ProductSeoResponse sellerSeoFriendlyProductSuggestion(ProductSeoRequest request) {
        try {
            String response = chatClient.prompt()
                    .system(SEO_SYSTEM_PROMPT)
                    .user(String.format(
                            "Generate SEO-friendly title and description for:\n" +
                                    "Product: %s\nCategory: %s\nKey Features: %s\nTarget audience: ecommerce shoppers",
                            request.getName(),
                            request.getCategory(),
                            request.getFeatures()))
                    .call()
                    .content();

            return mapper.readValue(response, ProductSeoResponse.class);

        } catch (Exception e) {
            log.error("SEO generation failed for product: {}", request.getName(), e);
            return ProductSeoResponse.builder()
                    .title("SEO-Friendly " + request.getName())
                    .description("Discover amazing " + request.getName() +
                            " with premium features. Perfect for " + request.getCategory() + " enthusiasts.")
                    .build();
        }
    }

    @Override
    public String askAiForProductDetails(long productId, String question) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not available"));

            List<Product> similarBestSellers = orderItemRepository.ourSellProducts(5);
            String context = buildProductContext(product, similarBestSellers);

            return chatClient.prompt()
                    .system(PRODUCT_ASSISTANT_SYSTEM_PROMPT)
                    .user("Product Context:\n" + context + "\n\nCustomer Question: " + question)
                    .call()
                    .content();

        } catch (Exception e) {
            log.error("Error processing product question for ID: {}", productId, e);
            return "I apologize, but I'm having trouble accessing product information right now. Please try again later.";
        }
    }

    //  general question (User or Guest)
    @Override
    public String askAi(String question, String jwt) {
        try {
            User user = null;
            if (jwt != null) {
                user = userService.getUserFromJwt(jwt);
            }

            String context = buildUserContext(user, jwt);
            boolean isAuthenticated = user != null;

            String userPrompt = isAuthenticated ?
                    "This is a registered user. Provide personalized recommendations based on their history." :
                    "This is a guest user. Focus on product benefits and encourage registration.";

            return chatClient.prompt()
                    .system(ECOMMERCE_ASSISTANT_SYSTEM_PROMPT + " " + userPrompt)
                    .user("E-commerce Context:\n" + context + "\n\nCustomer Question: " + question)
                    .call()
                    .content();

        } catch (Exception e) {
            log.error("Error processing AI question: {}", question, e);
            return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
        }
    }

    // context builders
    private String buildProductContext(Product product, List<Product> similarBestSellers) {
        return String.format(
                "CURRENT PRODUCT DETAILS:\n" +
                        "Title: %s\nDescription: %s\nPrice: MRP %d | Sale Price %d | Discount %.1f%%\n" +
                        "Available Quantity: %d\nColor: %s\nSizes: %s\nCategory: %s\nSeller: %s\nRating: %d reviews\n\n" +
                        "SIMILAR POPULAR PRODUCTS:\n%s",
                product.getTitle(),
                product.getDescription(),
                product.getMrpPrice(),
                product.getSellingPrice(),
                product.getDiscountInPercentage(),
                product.getStocks(),
                product.getColor(),
                product.getSizes(),
                product.getCategory() != null ? product.getCategory().getName() : "Uncategorized",
                product.getSeller() != null ? product.getSeller().getName() : "Unknown Seller",
                product.getNumRatings(),
                similarBestSellers.stream()
                        .limit(3)
                        .map(p -> String.format("- %s (%d PKR)", p.getTitle(), p.getSellingPrice()))
                        .collect(Collectors.joining("\n"))
        );
    }

    private String buildUserContext(User user, String jwt) {
        List<ProductResponse> allProducts = productService.getAllProducts();
        List<Product> topSellingProducts = orderItemRepository.ourSellProducts(20);

        StringBuilder context = new StringBuilder();

        context.append("TOP SELLING PRODUCTS:\n");
        topSellingProducts.forEach(product -> context.append(String.format(
                "- %s | Price: %d PKR | Discount: %.1f%% | Category: %s\n",
                product.getTitle(),
                product.getSellingPrice(),
                product.getDiscountInPercentage(),
                product.getCategory() != null ? product.getCategory().getName() : "General"
        )));

        if (user != null) {
            CartResponse userCart = cartService.findUserCart(jwt);
            List<OrderResponse> userOrders = orderService.userOrders(jwt);

            context.append(String.format(
                    "\nUSER PROFILE:\nName: %s\nEmail: %s\nAddress: %s\nCart Items: %d\nOrder History: %d orders\n" +
                            "FULL PRODUCT CATALOG (%d items):\n%s",
                    user.getFullName(),
                    user.getEmail(),
                    user.getAddress(),
                    userCart != null ? userCart.getCartItems().size() : 0,
                    userOrders != null ? userOrders.size() : 0,
                    allProducts.size(),
                    allProducts.stream()
                            .map(p -> String.format("- %s (%d PKR)", p.getTitle(), p.getSellingPrice()))
                            .collect(Collectors.joining("\n"))
            ));
        } else {
            context.append(String.format(
                    "\nUSER STATUS: Guest\nEncourage registration for personalized experience.\n" +
                            "FULL PRODUCT CATALOG (%d items):\n%s",
                    allProducts.size(),
                    allProducts.stream()
                            .limit(50)
                            .map(p -> String.format("- %s (%d PKR)", p.getTitle(), p.getSellingPrice()))
                            .collect(Collectors.joining("\n"))
            ));
        }

        return context.toString();
    }
}
