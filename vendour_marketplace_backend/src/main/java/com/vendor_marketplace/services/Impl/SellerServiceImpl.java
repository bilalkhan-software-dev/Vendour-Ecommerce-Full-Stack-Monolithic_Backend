package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.config.RabbitMQConfig;
import com.vendor_marketplace.dto.EmailMessage;
import com.vendor_marketplace.dto.request.SellerRequest;
import com.vendor_marketplace.dto.request.UpdateSellerRequest;
import com.vendor_marketplace.dto.response.SellerResponse;
import com.vendor_marketplace.entity.*;
import com.vendor_marketplace.exception.ExistDataException;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.exception.SameStatusUpdateException;
import com.vendor_marketplace.exception.WrongOtpException;
import com.vendor_marketplace.mapper.SellerMapper;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.repository.VerificationCodeRepository;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.services.SellerService;
import com.vendor_marketplace.utils.EmailSendingTemplate;
import com.vendor_marketplace.utils.RandomUtil;
import com.vendor_marketplace.entity.enums.AccountStatus;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationCodeRepository verificationCodeRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${frontend.react.url}")
    private String frontendUrl;

    @Override
    public SellerResponse getSellerProfile(String jwtToken) {

        String username = jwtService.extractUsername(jwtToken);
        Seller seller = sellerRepository.findByEmail(username).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + username)
        );
        log.info("Fetching profile info for user {}", username);
        return SellerMapper.toSellerResponse(seller);
    }

    @Override
    public Seller getSellerFromJwt(String jwtToken) {

        String username = jwtService.extractUsername(jwtToken);
        return sellerRepository.findByEmail(username).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + username)
        );
    }

    @Override
    public SellerResponse registerSeller(SellerRequest sellerRequest) {


        boolean isExists = sellerRepository.existsByEmail(sellerRequest.getEmail());
        if (isExists) {
            log.info("Seller {} already exists", sellerRequest.getEmail());
            throw new ExistDataException("Seller with email already exists! Try with another one.");
        }

        SellerRequest.SellerBankDetails bankDetails = sellerRequest.getBankDetails();
        SellerRequest.SellerBusinessDetails businessDetails = sellerRequest.getBusinessDetails();
        SellerRequest.Address pickupAddress = sellerRequest.getPickupAddress();

        Seller seller = Seller.builder()
                .name(sellerRequest.getName())
                .email(sellerRequest.getEmail())
                .password(passwordEncoder.encode(sellerRequest.getOtp()))
                .mobile(sellerRequest.getMobile())
                .STRN(sellerRequest.getSTRN())
                .accountStatus(AccountStatus.PENDING_VERIFICATION)
                .role(USER_ROLE.ROLE_SELLER)
                .bankDetails(
                        BankDetails.builder()
                                .accountHolderName(bankDetails.getAccountHolderName())
                                .accountNumber(bankDetails.getAccountNumber())
                                .IBAN(bankDetails.getIBAN())
                                .bankName(bankDetails.getBankName())
                                .build()
                )
                .businessDetails(
                        BusinessDetails.builder()
                                .banner(businessDetails.getBanner())
                                .logo(businessDetails.getLogo())
                                .businessAddress(businessDetails.getBusinessAddress())
                                .businessEmail(businessDetails.getBusinessEmail())
                                .businessMobileNumber(businessDetails.getBusinessMobileNumber())
                                .businessName(businessDetails.getBusinessName())
                                .build()
                )
                .pickupAddress(
                        Address.builder()
                                .name(pickupAddress.getName())
                                .address(pickupAddress.getAddress())
                                .state(pickupAddress.getState())
                                .pinCode(pickupAddress.getPinCode())
                                .city(pickupAddress.getCity())
                                .locality(pickupAddress.getLocality())
                                .mobile(pickupAddress.getMobile())
                                .build()
                )
                .build();
        String otp = RandomUtil.toGenerateOtp();
        VerificationCode code = VerificationCode.builder()
                .email(sellerRequest.getEmail())
                .otp(otp)
                .build();
        verificationCodeRepository.save(code);
        log.info("Frontend url :{}", frontendUrl);

        String encodedEmail = URLEncoder.encode(sellerRequest.getEmail(), StandardCharsets.UTF_8);

        String url = String.format("%s/verify-email/%s/%s", frontendUrl, encodedEmail, otp);
        log.info("Verify url: {}", url);
        String body = EmailSendingTemplate.sendEmailForOTPWithFrontendUrl(sellerRequest.getName(), otp, url);

        //  emailService.sendEmail(sellerRequest.getEmail(), "Email Verification", body);
        EmailMessage message = new EmailMessage(sellerRequest.getEmail(), "Seller Email Verification", body);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EMAIL_QUEUE_NAME, message);

        return SellerMapper.toSellerResponse(sellerRepository.save(seller));
    }

    @Override
    public void resendEmailVerification(String email) {

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + email)
        );

        if (seller.isEmailVerified()){
            throw new SameStatusUpdateException("Your email has already been verified");
        }

        // deleting the code if it is generated before
        verificationCodeRepository.findByEmail(email).ifPresent(verificationCodeRepository::delete);


        String otp = RandomUtil.toGenerateOtp();
        // generating and save the new one
        VerificationCode code = VerificationCode.builder()
                .email(email)
                .otp(otp)
                .build();
        verificationCodeRepository.save(code);

        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);


        String url = String.format("%s/verify-email/%s/%s", frontendUrl, encodedEmail, otp);
        String body = EmailSendingTemplate.sendEmailForOTPWithFrontendUrl(seller.getName(), otp, url);

        EmailMessage message = new EmailMessage(email, "Seller Email Verification", body);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EMAIL_QUEUE_NAME, message);
    }

    @Override
    public SellerResponse getSellerById(Long sellerId) {

        Seller seller = sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with id: " + sellerId)
        );
        return SellerMapper.toSellerResponse(seller);
    }

    @Override
    public SellerResponse getSellerByEmail(String email) {
        Seller seller = sellerRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + email)
        );
        return SellerMapper.toSellerResponse(seller);
    }

    @Override
    public List<SellerResponse> getAllSellers() {

        List<Seller> all = sellerRepository.findAll();

        return all.stream()
                .map(SellerMapper::toSellerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SellerResponse> getSellersByAccountStatus(AccountStatus accountStatus) {
        log.info("Getting all sellers by account status {}", accountStatus);
        List<Seller> byAccountStatus = sellerRepository.findByAccountStatus(accountStatus);
        return byAccountStatus.stream()
                .map(SellerMapper::toSellerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SellerResponse updateSellerProfile(String jwtToken, UpdateSellerRequest sellerRequest) {
        String username = jwtService.extractUsername(jwtToken);
        Seller seller = sellerRepository.findByEmail(username).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + username)
        );

        UpdateSellerRequest.SellerBankDetails bankDetails = sellerRequest.getBankDetails();
        UpdateSellerRequest.SellerBusinessDetails businessDetails = sellerRequest.getBusinessDetails();
        UpdateSellerRequest.Address pickupAddress = sellerRequest.getPickupAddress();

        if (sellerRequest.getName() != null) {
            seller.setName(sellerRequest.getName());
        }

        if (sellerRequest.getMobile() != null) {
            seller.setMobile(sellerRequest.getMobile());
        }

        if (sellerRequest.getSTRN() != null) {
            seller.setSTRN(sellerRequest.getSTRN());
        }

        if (sellerRequest.getBankDetails() != null) {
            seller.setBankDetails(
                    BankDetails.builder()
                            .accountHolderName(bankDetails.getAccountHolderName())
                            .accountNumber(bankDetails.getAccountNumber())
                            .IBAN(bankDetails.getIBAN())
                            .bankName(bankDetails.getBankName())
                            .build()
            );
        }

        if (sellerRequest.getBusinessDetails() != null) {
            seller.setBusinessDetails(
                    BusinessDetails.builder()
                            .banner(businessDetails.getBanner())
                            .logo(businessDetails.getLogo())
                            .businessAddress(businessDetails.getBusinessAddress())
                            .businessEmail(businessDetails.getBusinessEmail())
                            .businessMobileNumber(businessDetails.getBusinessMobileNumber())
                            .businessName(businessDetails.getBusinessName())
                            .build()
            );
        }

        if (sellerRequest.getPickupAddress() != null) {
            seller.setPickupAddress(
                    Address.builder()
                            .name(pickupAddress.getName())
                            .address(pickupAddress.getAddress())
                            .state(pickupAddress.getState())
                            .pinCode(pickupAddress.getPinCode())
                            .city(pickupAddress.getCity())
                            .locality(pickupAddress.getLocality())
                            .mobile(pickupAddress.getMobile())
                            .build()
            );
        }


        return SellerMapper.toSellerResponse(sellerRepository.save(seller));
    }

    @Override
    public void deleteSellerById(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with id: " + sellerId)
        );
        log.info("Seller deleted successfully with id: {}", sellerId);
        sellerRepository.delete(seller);
    }

    @Override
    public void deleteSellerByEmail(String email) {

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + email)
        );
        log.info("Seller deleted successfully with email: {}", email);
        sellerRepository.delete(seller);
    }

    @Override
    @Transactional
    public SellerResponse verifySellerEmail(String email, String otp) {

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("No OTP is generated with this email")
        );

        if (!verificationCode.getOtp().equals(otp)) {
            throw new WrongOtpException("OTP is Wrong");
        }

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with email: " + email)
        );

        if (seller.isEmailVerified()) {
            throw new SameStatusUpdateException("Your account already verified");
        }

        seller.setEmailVerified(true);
        seller.setAccountStatus(AccountStatus.ACTIVE);

        // delete otp code after verification
        verificationCodeRepository.delete(verificationCode);

        return SellerMapper.toSellerResponse(sellerRepository.save(seller));
    }

    @Override
    @Transactional
    public SellerResponse updateSellerAccountStatus(Long sellerId, AccountStatus accountStatus) {
        Seller seller = sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller not found with id: " + sellerId)
        );
        seller.setAccountStatus(accountStatus);

        return SellerMapper.toSellerResponse(sellerRepository.save(seller));
    }
}

