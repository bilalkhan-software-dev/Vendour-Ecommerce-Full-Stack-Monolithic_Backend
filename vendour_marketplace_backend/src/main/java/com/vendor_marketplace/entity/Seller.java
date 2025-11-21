package com.vendor_marketplace.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vendor_marketplace.entity.enums.AccountStatus;
import com.vendor_marketplace.entity.enums.USER_ROLE;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String mobile;

    @Column(unique = true,nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();

    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupAddress;

    private String STRN;
    /**
     * STRN (Sales Tax Registration Number):
     * Issued by the Federal Board of Revenue (FBR) to businesses that are registered for Sales Tax.
     * Required for businesses that make taxable supplies and must charge sales tax.
     */

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private boolean isEmailVerified =  false;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;





}
