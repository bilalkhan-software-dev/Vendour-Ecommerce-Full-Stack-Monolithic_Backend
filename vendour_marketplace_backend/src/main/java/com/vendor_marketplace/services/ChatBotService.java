package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.ProductSeoRequest;
import com.vendor_marketplace.dto.response.ProductSeoResponse;
import reactor.core.publisher.Flux;

public interface ChatBotService {

    ProductSeoResponse sellerSeoFriendlyProductSuggestion(ProductSeoRequest request);

    String askAiForProductDetails(long productId, String question);

    String askAi(String question, String jwt);

}
