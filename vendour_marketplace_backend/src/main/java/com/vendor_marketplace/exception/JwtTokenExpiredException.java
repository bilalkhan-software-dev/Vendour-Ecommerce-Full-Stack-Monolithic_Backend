package com.vendor_marketplace.exception;

public class JwtTokenExpiredException extends RuntimeException {
  public JwtTokenExpiredException(String message) {
    super(message);
  }
}
