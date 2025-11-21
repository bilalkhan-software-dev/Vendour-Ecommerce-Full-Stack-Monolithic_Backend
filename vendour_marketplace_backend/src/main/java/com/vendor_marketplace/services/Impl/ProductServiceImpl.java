package com.vendor_marketplace.services.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vendor_marketplace.dto.request.ProductCreateRequest;
import com.vendor_marketplace.dto.request.ProductUpdateRequest;
import com.vendor_marketplace.dto.response.PagedResponse;
import com.vendor_marketplace.dto.response.ProductResponse;
import com.vendor_marketplace.dto.response.ProductSearchResponse;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.ProductMapper;
import com.vendor_marketplace.repository.CategoryRepository;
import com.vendor_marketplace.repository.OrderItemRepository;
import com.vendor_marketplace.repository.ProductRepository;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.services.ProductService;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.vendor_marketplace.utils.CommonUtil.calculateDiscountPercentage;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final JwtService jwtService;
    private final SellerRepository sellerRepository;
    private final OrderItemRepository orderItemRepository;
    private final RedisUtil redisUtil;

    @Transactional
    @Override
    public ProductResponse createProduct(ProductCreateRequest productCreateRequest, String jwt) {

        Seller seller = getSellerFromJwt(jwt);

        Category category1 = createOrGetCategory(productCreateRequest.getCategory1(), 1, null);
        Category category2 = createOrGetCategory(productCreateRequest.getCategory2(), 2, category1);
        Category category3 = createOrGetCategory(productCreateRequest.getCategory3(), 3, category2);

        Category finalCategory = category3 != null ? category3 :
                category2 != null ? category2 :
                        category1;

        int discount = calculateDiscountPercentage(
                productCreateRequest.getMrpPrice(),
                productCreateRequest.getSellingPrice()
        );

        String brand = productCreateRequest.getBrand() != null ? productCreateRequest.getBrand() : seller.getBusinessDetails().getBusinessName();

        Product product = Product.builder()
                .title(productCreateRequest.getTitle())
                .description(productCreateRequest.getDescription())
                .createdAt(LocalDateTime.now())
                .mrpPrice(productCreateRequest.getMrpPrice())
                .sellingPrice(productCreateRequest.getSellingPrice())
                .color(productCreateRequest.getColor())
                .brand(brand)
                .seller(seller)
                .stocks(productCreateRequest.getStocks() != null ? productCreateRequest.getStocks() : 10)
                .images(productCreateRequest.getImages())
                .sizes(productCreateRequest.getSizes())
                .discountInPercentage((double) discount)
                .category(finalCategory)
                .build();
        Product saved = productRepository.save(product);
        log.info("Product added successfully! id: {}",saved.getId());
        redisUtil.deleteSimilarProduct();
        return ProductMapper.toProductResponse(saved);
    }

    private Category createOrGetCategory(String categoryId, int level, Category parent) {
        if (categoryId == null || categoryId.isBlank()) {
            return null;
        }

        String normalizedId = categoryId.trim().toLowerCase().replace(" ", "_");
        String categoryName = normalizedId.replace("_", " ");

        return categoryRepository.findByCategoryId(normalizedId)
                .orElseGet(() -> categoryRepository.save(
                        Category.builder()
                                .name(categoryName)
                                .categoryId(normalizedId)
                                .level(level)
                                .parentCategory(parent)
                                .build()
                ));
    }

    @Override
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with id: " + productId)
        );

        productRepository.delete(product);

    }

    @Override
    public ProductResponse findProductById(Long productId) {

        String cacheKey = RedisUtil.product(productId);
        ProductResponse cacheResponse = redisUtil.get(cacheKey, ProductResponse.class);
        if (cacheResponse != null) {
            return cacheResponse;
        }

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with id: " + productId)
        );
        ProductResponse response = ProductMapper.toProductResponse(product);
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);
        return response;
    }

    @Override
    public List<ProductSearchResponse> searchProduct(String query) {

        List<ProductSearchResponse> products = productRepository.searchProduct(query);
        return products.stream()
                .map(productSearchResponse -> new ProductSearchResponse(productSearchResponse.title(), productSearchResponse.categoryId()))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest productUpdateRequest) {
        log.info("Stock: {}", productUpdateRequest.getStocks());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Optional.ofNullable(productUpdateRequest.getTitle()).ifPresent(product::setTitle);
        Optional.ofNullable(productUpdateRequest.getDescription()).ifPresent(product::setDescription);
        Optional.ofNullable(productUpdateRequest.getMrpPrice()).ifPresent(product::setMrpPrice);
        Optional.ofNullable(productUpdateRequest.getSellingPrice()).ifPresent(product::setSellingPrice);
        Optional.ofNullable(productUpdateRequest.getColor()).ifPresent(product::setColor);
        Optional.ofNullable(productUpdateRequest.getImages()).ifPresent(product::setImages);
        Optional.ofNullable(productUpdateRequest.getSizes()).ifPresent(product::setSizes);
        Optional.ofNullable(productUpdateRequest.getStocks()).ifPresent(product::setStocks);

        if (product.getMrpPrice() != null && product.getSellingPrice() != null) {
            product.setDiscountInPercentage(
                    (double) calculateDiscountPercentage(product.getMrpPrice(), product.getSellingPrice())
            );
        }

        Category updatedCategory = null;
        if (productUpdateRequest.getCategory3() != null) {
            updatedCategory = createOrGetCategory(productUpdateRequest.getCategory3(), 3, null);
        } else if (productUpdateRequest.getCategory2() != null) {
            updatedCategory = createOrGetCategory(productUpdateRequest.getCategory2(), 2, null);
        } else if (productUpdateRequest.getCategory1() != null) {
            updatedCategory = createOrGetCategory(productUpdateRequest.getCategory1(), 1, null);
        }

        if (updatedCategory != null) {
            product.setCategory(updatedCategory);
        }

        ProductResponse response = ProductMapper.toProductResponse(productRepository.save(product));

        String cacheKey = RedisUtil.product(productId);
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);
        redisUtil.deleteProductFilterCache();
        return response;
    }


    @Override
    public PagedResponse<ProductResponse> findAllProducts(
            String productTitle, String categoryId, String brand, String colors, String sizes,
            Integer minPrice, Integer maxPrice, Integer minDiscount,
            String sort, String stock, Integer pageNumber
    ) {
        String cacheKey = RedisUtil.allFilterProduct(productTitle, categoryId, brand, colors, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber);

        PagedResponse<ProductResponse> cachedResponse = redisUtil.get(cacheKey, new TypeReference<PagedResponse<ProductResponse>>() {
        });

        if (cachedResponse != null) {
            return cachedResponse;
        }

        Specification<Product> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by categoryId
            if (categoryId != null && !categoryId.isBlank() && !"All".equalsIgnoreCase(categoryId)) {
                log.info("categoryId: {}",categoryId);
                Join<Product, Category> categoryJoin = root.join("category");
                predicates.add(cb.equal(cb.lower(categoryJoin.get("categoryId")), categoryId.toLowerCase()));
            }

            if (productTitle != null && !productTitle.isBlank()) {
                String searchValue = "%" + productTitle.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("title")), searchValue)
                                //cb.like(cb.lower(root.get("description")), searchValue)
                        )
                );
            }


            // Filter by brand
            if (brand != null && !brand.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
            }

            // Filter by colors
            if (colors != null && !colors.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("color")), colors.toLowerCase()));
            }

            // Filter by sizes
            if (sizes != null && !sizes.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("sizes")), sizes.toLowerCase()));
            }

            // Filter by price range
            if (minPrice != null && maxPrice != null) {
                predicates.add(cb.between(root.get("sellingPrice"), minPrice, maxPrice));
            } else if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            } else if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            // Filter by minimum discount
            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountInPercentage"), minDiscount.doubleValue()));
            }

            // Filter by stock
            if (stock != null) {
                if (stock.equalsIgnoreCase("in_stock")) {
                    predicates.add(cb.greaterThan(root.get("stocks"), 0));
                } else if (stock.equalsIgnoreCase("out_of_stock")) {
                    predicates.add(cb.equal(root.get("stocks"), 0));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Sorting
        Sort sortOption = Sort.by(Sort.Direction.DESC, "id"); // default
        if (sort != null) {
            switch (sort) {
                case "low_to_high" -> sortOption = Sort.by(Sort.Direction.ASC, "sellingPrice");
                case "high_to_low" -> sortOption = Sort.by(Sort.Direction.DESC, "sellingPrice");
                case "newest" -> sortOption = Sort.by(Sort.Direction.DESC, "id");
                case "oldest" -> sortOption = Sort.by(Sort.Direction.ASC, "id");
            }
        }

        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 12, sortOption);


        Page<Product> productPage = productRepository.findAll(specification, pageable);
        List<ProductResponse> responses = productPage.getContent().stream()
                .map(ProductMapper::toProductResponse)
                .toList();

        PagedResponse<ProductResponse> response = PagedResponse.<ProductResponse>builder()
                .content(responses)
                .pageNumber(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.TEN_MINUTES_CACHE_TTL);
        return response;
    }


    @Override
    public List<ProductResponse> getAllProducts() {

        List<Product> products = productRepository.findAll();

        return products.stream().map(ProductMapper::toProductResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> ourSellProducts(int limit) {

        List<Product> products = orderItemRepository.ourSellProducts(limit);

        return products.stream().map(ProductMapper::toProductResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> recentOrderProducts(int limit) {

        List<Product> products = orderItemRepository.findRecentlySoldProducts(limit);

        return products.stream().map(ProductMapper::toProductResponse).collect(Collectors.toList());
    }


    @Override
    public List<ProductResponse> getProductBySeller(String jwt) {

        Seller seller = getSellerFromJwt(jwt);

        List<Product> allProductsOfTheSeller = productRepository.findBySeller_id(seller.getId());

        return allProductsOfTheSeller.stream()
                .map(ProductMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> similarProducts(Long productId) {


        // limit to 12
        Pageable pageable = PageRequest.of(0, 12); // page = 0, size = 12


        // First checking if similar product are already in cache or not if yes then no db hit
        String cacheSimilarProductKey = RedisUtil.similarProduct(productId);
        List<ProductResponse> cachedSimilarProductResponse = redisUtil.get(cacheSimilarProductKey, new TypeReference<List<ProductResponse>>() {
        });
        if (cachedSimilarProductResponse != null && !cachedSimilarProductResponse.isEmpty()) {
            return cachedSimilarProductResponse;
        } else {
            // means the product is not in cache then first checking the product detail is available in cache if it then executes saving db query for product detail
            String cache = RedisUtil.product(productId);
            ProductResponse cachedResponse = redisUtil.get(cache, ProductResponse.class);
            if (cachedResponse != null) {
                List<Product> similarProductResponse = productRepository.findByCategory_CategoryIdOrTitleContainsOrderByIdDesc(cachedResponse.getCategory().getCategoryId(), cachedResponse.getTitle(), pageable);
                List<ProductResponse> mappedSimilarProduct = similarProductResponse.stream().map(ProductMapper::toProductResponse).toList();

                String cacheKey = RedisUtil.similarProduct(productId);
                redisUtil.saveToRedis(cacheKey, mappedSimilarProduct, RedisUtil.TWELVE_HOUR_CACHE_TTL);
                return mappedSimilarProduct;
            } else {

                Product product = productRepository.findById(productId).orElseThrow(
                        () -> new ResourceNotFoundException("Product not found with id: " + productId));
                List<Product> similarProductResponse = productRepository.findByCategory_CategoryIdOrTitleContainsOrderByIdDesc(product.getCategory().getCategoryId(), product.getTitle(), pageable);

                List<ProductResponse> mappedSimilarProduct = similarProductResponse.stream().map(ProductMapper::toProductResponse).toList();

                String cacheKey = RedisUtil.similarProduct(productId);
                redisUtil.saveToRedis(cacheKey, mappedSimilarProduct, RedisUtil.TWELVE_HOUR_CACHE_TTL);
                return mappedSimilarProduct;
            }
        }
    }

    @Override
    public List<ProductResponse> getProductBySellerId(Long sellerId) {

        sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found id: " + sellerId)
        );

        List<Product> allProductsOfTheSeller = productRepository.findBySeller_id(sellerId);

        return allProductsOfTheSeller.stream()
                .map(ProductMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateInventory(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        log.info("Request to update inventory: productId={}, quantity={}", productId, quantity);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        int currentStock = product.getStocks();

        if (currentStock < quantity) {
            log.warn("Insufficient stock for productId={}, currentStock={}, requested={}", productId, currentStock, quantity);
            throw new IllegalArgumentException("Not enough stock for product with id: " + productId);
        }

        int newStock = currentStock - quantity;
        product.setStocks(newStock);
        productRepository.save(product);
        log.info("Inventory updated: productId={}, oldStock={}, newStock={}", productId, currentStock, newStock);
        log.info("Updating product detail by id cache");
        String cacheKey = RedisUtil.product(productId);
        redisUtil.deleteFromRedis(cacheKey);
        log.info("Successfully deleted product with id: {} from cache",productId);
    }




    private Seller getSellerFromJwt(String jwt) {
        String username = jwtService.extractUsername(jwt);
        return sellerRepository.findByEmail(username).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found!."));
    }

    /* Discount calculating formula
    discount = (original price − selling price) ÷ original price × 100.
     */


    /*  Why using Specification
    Answer:
    Instead of writing fixed repository methods like findByCategoryAndPriceBetweenAndColor(...), you can build queries at runtime based on conditions.
    If request is:
    /products?category=Shoes&color=Black&minPrice=2000&maxPrice=5000

    It will dynamically generate:

    SELECT *
    FROM products p
    JOIN category c ON p.category_id = c.id
    WHERE c.name = 'Shoes'
    AND p.color = 'Black'
    AND p.selling_price BETWEEN 2000 AND 5000
    ORDER BY p.selling_price DESC
     */
}
