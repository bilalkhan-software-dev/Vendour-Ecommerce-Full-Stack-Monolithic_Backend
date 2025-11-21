package com.vendor_marketplace.services.Impl;


import com.vendor_marketplace.config.RabbitMQConfig;
import com.vendor_marketplace.dto.EmailMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE_NAME)
    public void sendEmail(EmailMessage emailMessage) throws MessagingException, UnsupportedEncodingException {
        log.info("Receiving email request from RabbitMQ Producer with email: {}", emailMessage.getTo());
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setTo(emailMessage.getTo());
            helper.setSubject(emailMessage.getSubject());
            helper.setFrom(sender, "Your Own Vendor (Do not reply)");
            helper.setText(emailMessage.getBody(), true);
            javaMailSender.send(mimeMessage);
            log.info("Email sent to {}", emailMessage.getTo());
        } catch (MessagingException e) {
            log.error("Mail send failed: {}", e.getMessage());
            throw new MailSendException("Failed to send mail for OTP. Please try again later.");
        }
    }

}
