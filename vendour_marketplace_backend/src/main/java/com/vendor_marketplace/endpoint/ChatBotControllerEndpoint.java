package com.vendor_marketplace.endpoint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RequestMapping("/api/v1/chat/ask/ai")
public interface ChatBotControllerEndpoint {

    @GetMapping("/detail/{productId}")
    ResponseEntity<?> askAiForProductDetails(@PathVariable long productId,@RequestParam String question);

    @GetMapping("/{question}")
    ResponseEntity<?> askAiWithLogin(
            @RequestHeader(AUTHORIZATION_HEADER) String jwt,@PathVariable
            String question);

    @GetMapping()
    ResponseEntity<?> askAi(@RequestParam String question);


}
