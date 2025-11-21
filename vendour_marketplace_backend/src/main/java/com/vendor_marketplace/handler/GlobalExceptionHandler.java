package com.vendor_marketplace.handler;

import com.stripe.exception.StripeException;
import com.vendor_marketplace.exception.*;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailSendException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final GenericResponseHandler response;

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<?> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());
        log.warn("Validation failed: {}", errors);
        return response.createErrorResponse("Validation Failed!", errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .toList();
        log.warn("Validation failed: {}", errors);
        return response.createErrorResponse("Validation Failed!", errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return response.createErrorResponseMessage("Invalid username or password", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Missing http failed: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleHttpMessageNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("Missing http failed: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return response.createErrorResponseMessage("You do not have permission to perform this action.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({UsernameNotFoundException.class, InvalidTokenException.class})
    public ResponseEntity<?> handleAuthExceptions(RuntimeException ex) {
        log.warn("Authentication error: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(),
                ex instanceof InvalidTokenException ? HttpStatus.UNAUTHORIZED : HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ExistDataException.class})
    public ResponseEntity<?> handleConflict(ExistDataException ex) {
        log.warn("Data conflict: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({
            StripeException.class,
            AccountDisableException.class,
            EmailVerifyException.class,
            WrongOtpException.class,
            CouponValidityException.class,
            PaymentMismatchException.class,
            PaymentProcessingException.class
    })
    public ResponseEntity<?> handleBadRequestExceptions(RuntimeException ex) {
        log.warn("Client error: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SameStatusUpdateException.class)
    public ResponseEntity<?> handleSameUpdateRequestExceptions(SameStatusUpdateException ex) {
        log.warn("Same status update: {}", ex.getMessage());
        return response.createBuildResponseMessage(ex.getMessage(), HttpStatus.OK);
    }


    @ExceptionHandler({MailSendException.class, OperationFailedException.class})
    public ResponseEntity<?> handleServerSideExceptions(RuntimeException ex) {
        log.error("Server operation failed: {}", ex.getMessage(), ex);
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingParameter(MissingServletRequestParameterException ex) {
        log.warn("Missing request parameter: {}", ex.getMessage());
        return response.createErrorResponseMessage("Missing parameter: " + ex.getParameterName(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());
        return response.createErrorResponseMessage(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return response.createErrorResponseMessage("An unexpected error occurred. Please contact support.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
