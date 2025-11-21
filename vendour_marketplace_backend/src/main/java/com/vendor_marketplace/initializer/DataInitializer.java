package com.vendor_marketplace.initializer;

import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import com.vendor_marketplace.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.info.name}")
    private String adminName;

    @Value("${admin.info.email}")
    private String adminEmail;

    @Value("${admin.info.mobile}")
    private String adminMobile;

    @Override
    @Transactional
    public void run(String... args) {
        initAdmin();
    }

    private void initAdmin() {
        User admin = User.builder()
                .role(USER_ROLE.ROLE_ADMIN)
                .password(passwordEncoder.encode("password"))
                .createdAt(LocalDateTime.now())
                .fullName(adminName)
                .email(adminEmail)
                .mobile(adminMobile)
                .build();

        userRepository.findByEmail(admin.getEmail()).ifPresentOrElse(
                u -> log.info("Admin already exists"),
                () -> {
                    log.info("Creating admin user");
                    userRepository.save(admin);
                }
        );
    }

}
