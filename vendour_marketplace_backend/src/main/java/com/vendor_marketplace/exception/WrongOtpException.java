package com.vendor_marketplace.exception;

public class WrongOtpException extends RuntimeException {
    public WrongOtpException(String message) {
        super(message);
    }
}
