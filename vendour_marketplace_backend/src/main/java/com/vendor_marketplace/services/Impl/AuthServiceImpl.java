package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.config.RabbitMQConfig;
import com.vendor_marketplace.config.security.CustomUserServiceImpl;
import com.vendor_marketplace.dto.EmailMessage;
import com.vendor_marketplace.dto.response.AuthResponse;
import com.vendor_marketplace.dto.request.LoginRequest;
import com.vendor_marketplace.dto.request.RegisterRequest;
import com.vendor_marketplace.dto.request.SentOtpRequest;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.entity.enums.AccountStatus;
import com.vendor_marketplace.exception.*;
import com.vendor_marketplace.repository.CartRepository;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.repository.UserRepository;
import com.vendor_marketplace.repository.VerificationCodeRepository;
import com.vendor_marketplace.services.AuthService;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.utils.EmailSendingTemplate;
import com.vendor_marketplace.utils.RandomUtil;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static com.vendor_marketplace.utils.Constants.LOGIN_PREFIX;
import static com.vendor_marketplace.utils.Constants.SELLER_PREFIX;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationCodeRepository verificationCodeRepository;
    private final CartRepository cartRepository;
    private final JwtService jwtService;
    private final RabbitTemplate rabbitTemplate;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;

    @Override
    public AuthResponse registerUser(RegisterRequest registerRequest) {

        log.info("Receiving Register Request for client {} with OTP: {}", registerRequest.getEmail(), registerRequest.getFullName());
        boolean isExisted = userRepository.existsByEmail(registerRequest.getEmail());
        if (isExisted) {
            log.info("User with email: {} already exists! Try with another one.", registerRequest.getEmail());
            throw new ExistDataException("User with email already exists! Try with another one.");
        }
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(registerRequest.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("No OTP is generated with this email: " + registerRequest.getEmail() + ". Please generate OTP to register your account")
        );
        if (!verificationCode.getOtp().equals(registerRequest.getOtp())) {
            log.info("OTP wrong");
            throw new WrongOtpException("Wrong OTP.");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFullName())
                .password(passwordEncoder.encode(registerRequest.getOtp()))
                .role(USER_ROLE.ROLE_CUSTOMER)
                .mobile("03**-********")
                .createdAt(LocalDateTime.now())
                .build();
        User isSaved = userRepository.save(user);
        if (!ObjectUtils.isEmpty(isSaved)) {
            Cart cart = new Cart();
            cart.setUser(isSaved);
            cartRepository.save(cart);
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));
            Authentication authentication = new UsernamePasswordAuthenticationToken(isSaved.getEmail(), null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtService.generateToken(authentication);
            AuthResponse authResponse = mapToDto(isSaved);
            authResponse.setToken(token);
            return authResponse;
        }
        return null;
    }


    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {

        String email = loginRequest.getEmail();
        String otp = loginRequest.getOtp();
        log.info("Receiving Login Request for client {} with OTP: {}", email, otp);
        Authentication authentication = authentication(email, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        System.out.println("Authentication role: " + authentication.getPrincipal());
        String token = jwtService.generateToken(authentication);
        return AuthResponse.builder()
                .token(token)
                .email(email)
                .role(String.valueOf(USER_ROLE.valueOf(role)))
                .build();
    }

    private Authentication authentication(String email, String otp) {

        // If seller is entering in login then I look like seller_abd@gmail.com
        // sent to customUserServiceImpl which extract the actual seller like abc@gmail.com
        UserDetails userDetails = customUserService.loadUserByUsername(email);

        // Still now seller email is look like seller_abc@gmail.com
        // but in our database during register seller we save our seller with code
        // that's why first extract actual seller email so we can find it from database
        if (email.startsWith(SELLER_PREFIX)) {
            email = email.substring(SELLER_PREFIX.length());
        }
        if (userDetails == null) {
            throw new BadCredentialsException("User not found");
        }

        // Verify OTP
        VerificationCode verificationCode = verificationCodeRepository.findByEmailWithoutOptional(email);

        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new WrongOtpException("Wrong OTP.");
        }
        // If OTP successfully verified
        return new UsernamePasswordAuthenticationToken(userDetails, otp, userDetails.getAuthorities());
    }

    private AuthResponse mapToDto(User user) {
        return AuthResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }


    @Override
    @Transactional
    public void getOtpForRegisterOrLogin(SentOtpRequest sentOtpRequest) {
        log.info("Receiving OTP Request for client {} with role: {}", sentOtpRequest.getEmail(), sentOtpRequest.getRole());


        if (sentOtpRequest.getRole().equals(USER_ROLE.ROLE_SELLER)) {
            Seller seller = sellerRepository.findByEmailWithoutOptional(sentOtpRequest.getEmail());
            if (seller == null) {
                throw new ResourceNotFoundException("Seller not found with email: " + sentOtpRequest.getEmail());
            }
            if (!seller.isEmailVerified()) {
                throw new AccountDisableException("Verify your account. Verification link sent to your email: " + seller.getEmail());
            }

            validateAccountStatus(seller);
        }

        String email = sentOtpRequest.getEmail();
        if (email.startsWith(LOGIN_PREFIX)) {
            email = email.substring(LOGIN_PREFIX.length());
        } else {

            User user = userRepository.findByUsername(email);
            if (user == null && sentOtpRequest.getRole().equals(USER_ROLE.ROLE_CUSTOMER)) {
                throw new ResourceNotFoundException("User not found with email: " + email);
            }
        }


        VerificationCode verificationCode = verificationCodeRepository.findByEmailWithoutOptional(email);
        if (verificationCode != null) {
            verificationCodeRepository.delete(verificationCode);
        }

        String otp = RandomUtil.toGenerateOtp();
        String finalEmail = sentOtpRequest.getRole().equals(USER_ROLE.ROLE_SELLER)
                ? sentOtpRequest.getEmail()
                : email;
        log.info("Generated OTP: {}  for {} ",otp ,finalEmail);
        VerificationCode setCode = new VerificationCode();
        setCode.setOtp(otp);
        setCode.setEmail(finalEmail);
        VerificationCode save = verificationCodeRepository.save(setCode);

        if (!ObjectUtils.isEmpty(save)) {
            String body = EmailSendingTemplate.sendEmailForOTP(finalEmail, otp);
            /* Synchronously way of sending email
            emailService.sendEmail(email, "Email Verification", body);
             */
            // Asynchronously way sending email
            EmailMessage emailMessage = new EmailMessage(email, "Email Verification OTP", body);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EMAIL_QUEUE_NAME, emailMessage);
            return;
        }
        throw new OperationFailedException("Failed to save OTP!. Please try again later.");
    }

    private void validateAccountStatus(Seller seller) {
        switch (seller.getAccountStatus()) {
            case PENDING_VERIFICATION ->
                    throw new AccountDisableException("Verify your account. Verification link sent to your email: " + seller.getEmail());
            case DEACTIVATED -> throw new AccountDisableException("Account is deactivated.");
            case BANNED -> throw new AccountDisableException("Account is banned.");
            case SUSPENDED -> throw new AccountDisableException("Account is suspended.");
            case CLOSED -> throw new AccountDisableException("Account is closed.");
        }
    }

}
