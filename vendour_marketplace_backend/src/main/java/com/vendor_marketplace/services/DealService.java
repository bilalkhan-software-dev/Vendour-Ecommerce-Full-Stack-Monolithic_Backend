package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.DealRequest;
import com.vendor_marketplace.dto.request.UpdateDealRequest;
import com.vendor_marketplace.dto.response.DealResponse;

import java.util.List;

public interface DealService {


    // For admin only
    DealResponse createDeal(DealRequest dealRequest);

    // for admin only
    DealResponse updateDeal(Long dealId, UpdateDealRequest dealRequest);


    // For admin only
    void deleteDeal(Long dealId);

    List<DealResponse> allDeal();


}
