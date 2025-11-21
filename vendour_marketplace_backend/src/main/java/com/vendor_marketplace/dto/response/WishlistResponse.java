package com.vendor_marketplace.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishlistResponse {

    private Long wishlistId;

    private UserResponse user;

    @Builder.Default
    private Set<ProductResponse> products =  new HashSet<>();



}
