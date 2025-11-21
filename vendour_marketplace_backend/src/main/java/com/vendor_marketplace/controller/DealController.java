package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.DealRequest;
import com.vendor_marketplace.dto.request.UpdateDealRequest;
import com.vendor_marketplace.dto.response.DealResponse;
import com.vendor_marketplace.endpoint.DealControllerEndpoint;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class DealController implements DealControllerEndpoint {

    private final DealService dealService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> createDeal(DealRequest dealRequest) {

        DealResponse deal = dealService.createDeal(dealRequest);
        if (!ObjectUtils.isEmpty(deal)) {
            return response.createBuildResponse("Deal created successfully!", deal, HttpStatus.CREATED);
        }

        return response.createErrorResponseMessage("Deal creation failed!", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<?> updateDeal(Long dealId, UpdateDealRequest dealRequest) {

        DealResponse updatedDeal = dealService.updateDeal(dealId, dealRequest);

        return response.createBuildResponse("Deal updated successfully!", updatedDeal, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteDeal(Long dealId) {

        dealService.deleteDeal(dealId);

        return response.createErrorResponseMessage("Deal deleted successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> allDeals() {

        List<DealResponse> dealResponses = dealService.allDeal();

        if (!CollectionUtils.isEmpty(dealResponses)) {
            return response.createBuildResponse("All deal retrieved successfully!", dealResponses, HttpStatus.OK);
        }

        return response.createErrorResponseMessage("You currently didn't have any created deal!", HttpStatus.NO_CONTENT);
    }
}
