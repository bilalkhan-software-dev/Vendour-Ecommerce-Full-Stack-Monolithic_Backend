package com.vendor_marketplace.exception;

public class PaymentMismatchException extends RuntimeException {
  public PaymentMismatchException(String message) {
    super(message);
  }
}
