package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.exception.InvalidTokenException;
import com.vendor_marketplace.exception.JwtTokenExpiredException;
import com.vendor_marketplace.services.JwtService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER_PREFIX;
import static com.vendor_marketplace.utils.Constants.JWT_TOKEN_EXPIRATION;

@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret.key}")
    private String secretKey;

    private SecretKey getKey() {
        byte[] key = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(key);
    }


    @Override
    public String generateToken(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList());

        return Jwts.builder()
                .claims().add(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .subject(authentication.getName())
                .expiration(new Date(System.currentTimeMillis() + JWT_TOKEN_EXPIRATION))
                .and()
                .signWith(getKey())
                .compact();
    }



    public Claims extractAllClaims(String token) {
        try {
            if (token.startsWith(AUTHORIZATION_HEADER_PREFIX)){
                token = token.substring(AUTHORIZATION_HEADER_PREFIX.length());
            }
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtTokenExpiredException("Token is expired");
        } catch (JwtException e) {
            throw new InvalidTokenException("Jwt token is invalid");
        } catch (Exception e) {
            log.error("Error when extracting claims :{}", e.getMessage());
            throw e;
        }
    }


    private boolean isTokenExpired(String token) {
        Claims extractedAllClaims = extractAllClaims(token);
        Date expiration = extractedAllClaims.getExpiration();
        return expiration.before(new Date());
    }

    @Override
    public String extractUsername(String token) {
        Claims extractedAllClaims = extractAllClaims(token);
        return extractedAllClaims.getSubject();
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        boolean isTokenExpired = isTokenExpired(token);
        return username.equalsIgnoreCase(userDetails.getUsername()) && !isTokenExpired;
    }

    @Override
    public Long getUserIdFromToken(String token) {
        Object userIdObj = extractAllClaims(token).get("userId");
        if (userIdObj instanceof Integer) {
            return ((Integer) userIdObj).longValue();
        } else if (userIdObj instanceof Long) {
            return (Long) userIdObj;
        } else {
            throw new InvalidTokenException("userId claim is missing or invalid");
        }
    }
}
