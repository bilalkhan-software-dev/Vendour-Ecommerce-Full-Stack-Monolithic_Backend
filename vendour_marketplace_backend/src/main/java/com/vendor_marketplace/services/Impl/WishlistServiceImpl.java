package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.response.WishlistResponse;
import com.vendor_marketplace.entity.Product;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.entity.Wishlist;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.WishlistMapper;
import com.vendor_marketplace.repository.ProductRepository;
import com.vendor_marketplace.repository.WishlistRepository;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.services.WishlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserService userService;
    private final ProductRepository productRepository;

    @Override
    public WishlistResponse createWishlist(String jwt) {

        User user = userService.getUserFromJwt(jwt);

        // if wishlist is already created then we don't need to create again. That's why using this function
        if (wishlistRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException("Wishlist already exists for this user");
        }

        Wishlist newWishlist = Wishlist.builder()
                .user(user)
                .build();
        return WishlistMapper.toWishlistResponse(wishlistRepository.save(newWishlist));
    }

    @Override
    public WishlistResponse getWishlistByUser(String jwt) {

        User user = userService.getUserFromJwt(jwt);
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId());

        if (wishlist == null) {
            wishlist = Wishlist.builder()
                    .user(user)
                    .build();
            wishlist = wishlistRepository.save(wishlist);
        }
        return WishlistMapper.toWishlistResponse(wishlist);
    }

    @Transactional
    @Override
    public WishlistResponse addProductToWishlist(String jwt, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("The product you want to add in wishlist is not found in database:")
        );
        User user = userService.getUserFromJwt(jwt);

        Wishlist wishlist = wishlistRepository.findByUserId(user.getId());
        if (wishlist == null) {
            wishlist = Wishlist.builder()
                    .user(user)
                    .build();
            wishlistRepository.save(wishlist);
        }


        // If product already added in wishlist then remove
        if (wishlist.getProducts().contains(product)) {
            wishlist.getProducts().remove(product);
        }
        // if it is not added before then adding
        else {
            wishlist.getProducts().add(product);
        }

        return WishlistMapper.toWishlistResponse(wishlistRepository.save(wishlist));
    }

}
