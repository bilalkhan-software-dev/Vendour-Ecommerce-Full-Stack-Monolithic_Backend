package com.vendor_marketplace.controller;

import com.vendor_marketplace.endpoint.ChatBotControllerEndpoint;
import com.vendor_marketplace.services.ChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

@RestController
@RequiredArgsConstructor
public class ChatBotController implements ChatBotControllerEndpoint {


    private final ChatBotService chatBotService;

    @Override
    public ResponseEntity<String> askAiForProductDetails(long productId, String question) {

        String chatBotResponse = chatBotService.askAiForProductDetails(productId, question);

        return ResponseEntity.ok(chatBotResponse);
    }

    @Override
    public ResponseEntity<String> askAiWithLogin(String jwt, String question) {

        String chatBotResponse = chatBotService.askAi(question, jwt);

        return ResponseEntity.ok(chatBotResponse);
    }

    @Override
    public ResponseEntity<?> askAi(String question) {

        String s = chatBotService.askAi(question, null);
        return ResponseEntity.ok(s);
    }
}
