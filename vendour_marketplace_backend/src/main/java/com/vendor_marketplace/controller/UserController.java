package com.vendor_marketplace.controller;

import com.vendor_marketplace.dto.request.UpdateUserRequest;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.endpoint.UserControllerEndpoint;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.handler.GenericResponseHandler;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController implements UserControllerEndpoint {

    private final UserService userService;
    private final GenericResponseHandler response;

    @Override
    public ResponseEntity<?> deleteUser(Long userId) {

        userService.deleteUser(userId);


        return response.createBuildResponseMessage("User deleted successfully!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateUser(String jwt, UpdateUserRequest updateUserRequest) {

        UserResponse userResponse = userService.updateUserProfile(jwt, updateUserRequest);

        return response.createBuildResponse("Profile updated successfully!", userResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getUserProfile(String jwt) {

        UserResponse userProfile = userService.getUserProfile(jwt);

        return response.createBuildResponse("Profile retrieved successfully!", userProfile, HttpStatus.OK);
    }



}
