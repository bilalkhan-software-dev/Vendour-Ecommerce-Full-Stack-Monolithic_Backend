package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.response.SellerReportResponse;
import com.vendor_marketplace.entity.Seller;
import com.vendor_marketplace.entity.SellerReport;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.SellerReportMapper;
import com.vendor_marketplace.repository.SellerReportRepository;
import com.vendor_marketplace.repository.SellerRepository;
import com.vendor_marketplace.services.SellerReportService;
import com.vendor_marketplace.services.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class SellerReportServiceImpl implements SellerReportService {

    private final SellerReportRepository sellerReportRepository;
    private final SellerService sellerService;
    private final SellerRepository sellerRepository;


    @Override
    public SellerReportResponse getSellerReport(String jwt) {

        Seller seller = sellerService.getSellerFromJwt(jwt);
        SellerReport sellerReport = sellerReportRepository.findBySellerId(seller.getId());
        log.info("Creating seller report for id: {}",seller.getId());
        if (sellerReport == null){
            SellerReport report = SellerReport.builder()
                    .seller(seller)
                    .build();
            return SellerReportMapper.toSellerReportResponse(sellerReportRepository.save(report));
        }

        return SellerReportMapper.toSellerReportResponse(sellerReport);
    }

    @Override
    public SellerReport getSellerReportBySellerId(Long sellerId) {

        Seller seller = sellerRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException("Seller Not Found with id: "+sellerId)
        );
        SellerReport sellerReport = sellerReportRepository.findBySellerId(sellerId);

        if (sellerReport == null){
            SellerReport report = SellerReport.builder()
                    .seller(seller)
                    .build();
            return sellerReportRepository.save(report);
        }

        return sellerReport;
    }

    @Override
    public void updateSellerReport(SellerReport sellerReport) {

        SellerReportMapper.toSellerReportResponse(sellerReportRepository.save(sellerReport));
    }
}
