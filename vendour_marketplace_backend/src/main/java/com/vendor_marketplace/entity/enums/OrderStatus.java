package com.vendor_marketplace.entity.enums;

public enum OrderStatus {
    PLACED,        // Customer placed order
    CONFIRMED,     // Seller confirmed stock & payment
    PACKED,        // Items packed in warehouse
    SHIPPED,       // Handover to courier
    OUT_FOR_DELIVERY, //  Courier en route
    DELIVERED,     // Successfully delivered
    CANCELLED,     // Cancelled before delivery
    RETURNED       // (Optional) Returned by customer
}
