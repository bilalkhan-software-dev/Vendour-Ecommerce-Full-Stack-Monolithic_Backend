package com.vendor_marketplace.utils;

import java.util.concurrent.TimeUnit;

public class Constants {
    public static final Long JWT_TOKEN_EXPIRATION = TimeUnit.DAYS.toMillis(3);
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String AUTHORIZATION_HEADER_PREFIX = "Bearer ";
    public static final String SELLER_PREFIX = "seller_";
    public static final String LOGIN_PREFIX = "login_";
    public static final int OTP_LENGTH = 6;
    public static final String FOR_ADMIN_ONLY = "hasRole('ADMIN')";
    public static final String FOR_SELLER_ONLY = "hasRole('SELLER')";



    // system prompts for spring AI
    public static final String SEO_SYSTEM_PROMPT = """
            You are an SEO assistant. Respond ONLY in JSON with 'title' and 'description'.
            Create compelling, SEO-friendly titles and descriptions that include relevant keywords.
            """;

    public static final String PRODUCT_ASSISTANT_SYSTEM_PROMPT = """
            You are an ecommerce product specialist. Provide accurate, detailed information about products.
            Be helpful and informative while staying within the provided context.
            """;

    public static final String ECOMMERCE_ASSISTANT_SYSTEM_PROMPT = """
            You are an ecommerce assistant. Use the provided context to answer questions accurately.
            Be friendly, helpful, and persuasive when appropriate.
            If you don't know something based on the context, politely say so.
            For guest users, focus on product benefits and create compelling reasons to purchase.
            """;

}