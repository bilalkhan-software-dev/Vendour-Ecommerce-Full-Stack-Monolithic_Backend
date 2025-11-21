package com.vendor_marketplace.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;


    @GetMapping("/health")
    public String index() {
        return "Hello World | Application is running";
    }

    @GetMapping("/test-db")
    public ResponseEntity<?> checkDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "message", "Database connection established successfully"
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "DOWN",
                    "message", "Database connection could not be established",
                    "error", ex.getMessage()
            ));
        }
    }

}
