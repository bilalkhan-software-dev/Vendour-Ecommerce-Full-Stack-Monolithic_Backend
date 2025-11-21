package com.vendor_marketplace.endpoint;

import com.vendor_marketplace.dto.request.UpdateUserRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;


@RequestMapping("/api/v1/user")
public interface UserControllerEndpoint {

    @DeleteMapping("/delete/{userId}")
    ResponseEntity<?> deleteUser(@PathVariable Long userId);

    @PutMapping("/update")
    ResponseEntity<?> updateUser(@RequestHeader(AUTHORIZATION_HEADER) String jwt,
                                 @RequestBody UpdateUserRequest updateUserRequest
    );

    @GetMapping("/profile")
    ResponseEntity<?> getUserProfile(@RequestHeader(AUTHORIZATION_HEADER) String jwt);



}
