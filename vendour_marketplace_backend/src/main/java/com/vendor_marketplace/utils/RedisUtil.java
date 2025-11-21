package com.vendor_marketplace.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vendor_marketplace.entity.Order;
import com.vendor_marketplace.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Slf4j
public class RedisUtil {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public static final Duration ONE_DAY_CACHE_TTL = Duration.ofDays(1);
    public static final Duration FIVE_DAYS_CACHE_TTL = Duration.ofDays(5);
    public static final Duration ONE_HOUR_CACHE_TTL = Duration.ofHours(1);
    public static final Duration TEN_MINUTES_CACHE_TTL = Duration.ofMinutes(10);
    public static final Duration TWELVE_HOUR_CACHE_TTL = Duration.ofHours(1);
    public static final Duration CACHE_TTL = Duration.ofDays(1);


    public static String user(Long userId) {
        return "user:" + userId;
    }

    public static String userOrders(Long userId) {
        return "orders:user:" + userId;
    }

    public static String userCart(Long userId) {
        return "cart:user:" + userId;
    }

    public static String sellerOrders(Long sellerId) {
        return "orders:seller:" + sellerId;
    }

    public static String order(Long orderId) {
        return "order:" + orderId;
    }

    public static String orderItem(Long itemId) {
        return "order:item:" + itemId;
    }

    public static String cartItem(Long cartItemId) {
        return "cart:item:" + cartItemId;
    }

    public static String cart(Long cartId) {
        return "cart:" + cartId;
    }

    public static String homeCategory(Long homeCategoryId) {
        return "home:category:" + homeCategoryId;
    }

    public static String product(Long productId) {
        return "products:" + productId;
    }

    public static String similarProduct(Long productId) {
        return "products:similar:" + productId;
    }

    public static String allFilterProduct(
            String productTitle, String categoryId, String brand,
            String colors, String sizes, Integer minPrice,
            Integer maxPrice, Integer minDiscount, String sort,
            String stock, Integer pageNumber
    ) {
        StringBuilder sb = new StringBuilder("all:products:filter");

        if (productTitle != null) sb.append(":productTitle=").append(productTitle);
        if (categoryId != null) sb.append(":categoryId=").append(categoryId);
        if (brand != null) sb.append(":brand=").append(brand);
        if (colors != null) sb.append(":color=").append(colors);
        if (sizes != null) sb.append(":size=").append(sizes);
        if (minPrice != null) sb.append(":minPrice=").append(minPrice);
        if (maxPrice != null) sb.append(":maxPrice=").append(maxPrice);
        if (minDiscount != null) sb.append(":minDiscount=").append(minDiscount);
        if (sort != null) sb.append(":sort=").append(sort);
        if (stock != null) sb.append(":stock=").append(stock);
        if (pageNumber != null) sb.append(":pageNumber=").append(pageNumber);

        return sb.toString();
    }


    public void deleteProductFilterCache() {
        Set<String> keys = scanKeys("all:products:filter:*");
        if (!keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.debug("Deleted {} product filter cache keys", keys.size());
        }
    }

    public static String userReview(Long userId) {
        return "reviews:user:" + userId;
    }

    public static String productReviews(Long productId) {
        return "reviews:product:" + productId;
    }

    public static String allCoupon(String status) {
        return "all:coupons:status:" + status;
    }

    public void deleteCouponCache() {
        redisTemplate.delete(Arrays.asList(
                "all:coupons:status:all",
                "all:coupons:status:active",
                "all:coupons:status:inactive"
        ));
    }

    public void evictOrderCaches(Set<Order> orders) {

        Set<String> keysToDelete = new HashSet<>();

        for (Order order : orders) {
            // specific order and order item caches
            keysToDelete.add(RedisUtil.order(order.getId()));
            for (OrderItem item : order.getOrderItems()) {
                keysToDelete.add(RedisUtil.orderItem(item.getId()));
            }

            // user + seller order list caches
            keysToDelete.add(RedisUtil.userOrders(order.getUser().getId()));
            keysToDelete.add(RedisUtil.sellerOrders(order.getSellerId()));

        }

        if (!keysToDelete.isEmpty()) {
            redisTemplate.delete(keysToDelete);
            log.info("Evicted specific order-related Redis keys: {}", keysToDelete);
        }
    }


    // for admin
    public void deleteAllOrderCaches() {
        Set<String> keys = new HashSet<>();
        keys.addAll(scanKeys("orders:user:*"));
        keys.addAll(scanKeys("orders:seller:*"));
        if (!keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Deleted all user/seller order caches from Redis");
        }
    }

    public void deleteSimilarProduct() {
        Set<String> keys = new HashSet<>();
        keys.addAll(scanKeys("products:similar:*"));
        if (!keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Deleted all similar products caches from Redis");
        }
    }


    public void deleteUserAndSellerOrdersCache(Long userId, Long sellerId) {
        Set<String> keys = Set.of(
                RedisUtil.userOrders(userId),
                RedisUtil.sellerOrders(sellerId)
        );

        redisTemplate.delete(keys);
        log.info("Deleted Redis caches for userId={} and sellerId={}", userId, sellerId);
    }


    public static String allHomeCategory() {
        return "home:category:all";
    }


    public void saveToRedis(String key, Object value, Duration ttl) {
        if (value == null) {
            return;
        }

        redisTemplate.opsForValue().set(key, value, ttl);
        log.debug("Saved to Redis cache key={} with TTL={}s", key, ttl.getSeconds());
    }

    public void deleteFromRedis(String key) {
        redisTemplate.delete(key);
    }


    // for non-generic like User,Order etc
    public <T> T get(String key, Class<T> type) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            return null;
        }

        // If the object is already the right type, just return it
        if (type.isInstance(value)) {
            return type.cast(value);
        }

        // Safely convert LinkedHashMap → target object
        return objectMapper.convertValue(value, type);
    }


    // for generic like List<User> , List<Order> etc. also Map
    public <T> T get(String key, TypeReference<T> typeReference) {
        Object value = redisTemplate.opsForValue().get(key);
        if (value == null) return null;
        return objectMapper.convertValue(value, typeReference);
    }


    public Set<String> scanKeys(String pattern) {
        // Initialize a set to store the keys we find
        Set<String> keys = new HashSet<>();

        // Get the Redis connection factory from the RedisTemplate
        RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();

        // If Redis is not connected or not configured properly, return an empty set
        if (connectionFactory == null) return keys;

        // Create SCAN options:
        // match(pattern) = only return keys that match the given pattern
        // count(1000) = Redis will try (not guaranteed) to return up to 1000 keys per iteration
        ScanOptions options = ScanOptions.scanOptions().match(pattern).count(1000).build();

        // Use try-with-resources to ensure both connection and cursor are closed automatically
        try (RedisConnection connection = connectionFactory.getConnection();

             // Use the new, non-deprecated API to start scanning keys
             Cursor<byte[]> cursor = connection.commands().scan(options)) {

            // Iterate through the cursor results
            while (cursor.hasNext()) {
                // Convert each key from byte[] to UTF-8 string and add to our set
                keys.add(new String(cursor.next(), StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            // Log any errors safely (e.g., Redis not available, scan interrupted, etc.)
            log.error("Error scanning Redis keys for pattern '{}': {}", pattern, e.getMessage());
        }
        // Return all matching keys found
        return keys;
    }


}
