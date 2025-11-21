package com.vendor_marketplace.endpoint;


import com.vendor_marketplace.dto.request.DealRequest;
import com.vendor_marketplace.dto.request.UpdateDealRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.FOR_ADMIN_ONLY;


@PreAuthorize(FOR_ADMIN_ONLY)
@RequestMapping("/api/v1/deal")
public interface DealControllerEndpoint {


    @PostMapping("/admin/create")
    ResponseEntity<?> createDeal(@Valid @RequestBody DealRequest dealRequest);

    @PatchMapping("/admin/update/{dealId}")
    ResponseEntity<?> updateDeal(
            @PathVariable Long dealId,
            @Valid @RequestBody UpdateDealRequest dealRequest
    );

    @DeleteMapping("/admin/delete/{dealId}")
    ResponseEntity<?> deleteDeal(@PathVariable Long dealId);

    @GetMapping("/all")
    ResponseEntity<?> allDeals();

}
