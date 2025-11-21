package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.request.UpdateUserRequest;
import com.vendor_marketplace.dto.response.UserResponse;
import com.vendor_marketplace.entity.User;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.UserMapper;
import com.vendor_marketplace.repository.UserRepository;
import com.vendor_marketplace.services.JwtService;
import com.vendor_marketplace.services.UserService;
import com.vendor_marketplace.utils.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RedisUtil redisUtil;


    @Override
    public User getUserFromJwt(String token) {
        String username = jwtService.extractUsername(token);
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with provided jwt: " + username));
    }

    @Override
    public UserResponse getUserDetailsById(Long userId) {
        String cacheKey = RedisUtil.user(userId);

        // Try from Redis first
        UserResponse cached = redisUtil.get(cacheKey, UserResponse.class);
        if (cached != null) return cached;

        // Otherwise fetch from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        UserResponse response = UserMapper.toUserResponse(user);

        // Cache for next time
        redisUtil.saveToRedis(cacheKey, response, RedisUtil.ONE_DAY_CACHE_TTL);

        return response;
    }

    @Override
    public UserResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(String jwt, UpdateUserRequest request) {
        User existingUser = getUserFromJwt(jwt);

        Optional.ofNullable(request.getFullName())
                .filter(fullName -> !Objects.equals(fullName, existingUser.getFullName()))
                .ifPresent(existingUser::setFullName);

        Optional.ofNullable(request.getMobile())
                .filter(mobile -> !Objects.equals(mobile, existingUser.getMobile()))
                .ifPresent(existingUser::setMobile);

        User saved = userRepository.save(existingUser);
        UserResponse response = UserMapper.toUserResponse(saved);

        // Update Redis
        redisUtil.saveToRedis(RedisUtil.user(saved.getId()), response, RedisUtil.ONE_DAY_CACHE_TTL);

        return response;
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        userRepository.delete(user);
        redisUtil.deleteFromRedis(RedisUtil.user(user.getId()));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserProfile(String jwt) {
        User user = getUserFromJwt(jwt);
        String cacheKey = RedisUtil.user(user.getId());

        UserResponse cached = redisUtil.get(cacheKey, UserResponse.class);
        if (cached != null) return cached;

        UserResponse response = UserMapper.toUserResponse(user);
        redisUtil.saveToRedis(RedisUtil.user(user.getId()), response, RedisUtil.ONE_DAY_CACHE_TTL);
        return response;
    }
}
