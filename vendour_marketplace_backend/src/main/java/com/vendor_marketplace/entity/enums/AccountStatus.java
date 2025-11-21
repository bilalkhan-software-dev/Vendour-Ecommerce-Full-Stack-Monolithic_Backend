package com.vendor_marketplace.entity.enums;

/**
 * PENDING_VERIFICATION, // Account is created but not verified
 * ACTIVE,               // Account is active and in good standing
 * SUSPENDED,            // Account is temporarily suspended, possibly due to violation
 * DEACTIVATED,          // Account is deactivated, user may have chosen to deactivate it
 * BANNED,               // Account is permanently banned due to severe violation
 * CLOSED                // Account is permanently closed, possibly at user request
 */

public enum AccountStatus {
    PENDING_VERIFICATION,
    ACTIVE,
    SUSPENDED,
    DEACTIVATED,
    BANNED,
    CLOSED
}
