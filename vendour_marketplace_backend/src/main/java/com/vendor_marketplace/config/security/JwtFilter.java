package com.vendor_marketplace.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vendor_marketplace.handler.GenericResponse;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static com.vendor_marketplace.utils.Constants.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserServiceImpl customUserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String header = request.getHeader(AUTHORIZATION_HEADER);

            if (header != null && header.startsWith(AUTHORIZATION_HEADER_PREFIX)) {
                String token = header.substring(AUTHORIZATION_HEADER_PREFIX.length());
                Claims claims = jwtService.extractAllClaims(token);
                String username = claims.getSubject();

                log.info("Username: {}",username);
                log.info("Token: {}",token);
                List<String> authorities = claims.get("roles", List.class);
                log.info("Roles: {}",authorities);

                if (authorities.stream().anyMatch( role -> role.equals(USER_ROLE.ROLE_SELLER.name()))){
                    log.info("Seller token detected");
                    username = SELLER_PREFIX + username;
                    log.info("Seller's token prefix added: {}",username);
                }
                log.info("Username before sent to UserDetails: {}",username);



                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = customUserService.loadUserByUsername(username);
                    if (jwtService.validateToken(token, userDetails)) {
                        List<GrantedAuthority> grantedAuthorities = authorities.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());
                        log.info("Authorities: {}", grantedAuthorities);
                        Authentication authentication =
                                new UsernamePasswordAuthenticationToken(
                                        username,
                                        null,
                                        grantedAuthorities);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception ex) {
            handleJwtException(response, ex);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        Object errors = GenericResponse.builder()
                .status("error")
                .message(e.getMessage())
                .httpStatus(HttpStatus.UNAUTHORIZED)
                .build().create().getBody();
        response.getWriter().write(new ObjectMapper().writeValueAsString(errors));
    }
}
