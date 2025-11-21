package com.vendor_marketplace.services;

import com.vendor_marketplace.dto.request.UpdateUserRequest;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.entity.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

import static com.vendor_marketplace.utils.Constants.AUTHORIZATION_HEADER;

public interface UserService {

    User getUserFromJwt(String token);

    UserResponse getUserDetailsById(Long userId);

    UserResponse getUserDetailsByEmail(String email);

    UserResponse updateUserProfile(
            String jwt,
            UpdateUserRequest updateUserRequest
    );

    UserResponse getUserProfile(String jwt);

    // For Admin or customer
    void deleteUser(Long userId);

    List<UserResponse> getAllUsers();


}
