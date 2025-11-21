package com.vendor_marketplace.exception;

public class SameStatusUpdateException extends RuntimeException {
    public SameStatusUpdateException(String message) {
        super(message);
    }
}
