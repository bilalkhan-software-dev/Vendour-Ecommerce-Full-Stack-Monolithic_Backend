package com.vendor_marketplace.config.security;

import com.vendor_marketplace.entity.Seller;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.repository.UserRepository;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.vendor_marketplace.utils.Constants.SELLER_PREFIX;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.startsWith(SELLER_PREFIX)) {
            String exactUsername = username.substring(SELLER_PREFIX.length());
            Seller seller = sellerRepository.findByEmail(exactUsername).orElseThrow(
                    () -> new UsernameNotFoundException("Seller not found with email: " + exactUsername)
            );
            return buildUserDetails(seller.getId(), seller.getEmail(), seller.getPassword(), seller.getRole());
        } else {
            User user = userRepository.findByEmail(username).orElseThrow(
                    () -> new UsernameNotFoundException("User not found with email: " + username)
            );
            return buildUserDetails(user.getId(), user.getEmail(), user.getPassword(), user.getRole());
        }
    }

    // We pass just email so when we fetch user from SecurityContextHolder -> Authentication -> getPrincipal = it will return logged-in user email (Authenticated User)
    private UserDetails buildUserDetails(Long id, String email, String password, USER_ROLE role) {
        if (role == null) {
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.name()));

        return new org.springframework.security.core.userdetails.User(
                email,
                password,
                authorities) {
        };
    }
}
