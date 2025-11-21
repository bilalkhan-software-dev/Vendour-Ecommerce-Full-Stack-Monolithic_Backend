package com.vendor_marketplace.services;

import com.vendor_marketplace.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String generateToken(Authentication authentication);

    String extractUsername(String token);

    Claims extractAllClaims(String token);

    boolean validateToken(String token, UserDetails userDetails);

    Long getUserIdFromToken(String token);

}
