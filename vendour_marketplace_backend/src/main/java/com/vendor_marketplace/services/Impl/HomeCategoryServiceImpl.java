package com.vendor_marketplace.services.Impl;

import com.vendor_marketplace.dto.request.HomeCategoryRequest;
import com.vendor_marketplace.dto.request.UpdateHomeCategoryRequest;
import com.vendor_marketplace.dto.response.HomeCategoryResponse;
import com.vendor_marketplace.entity.Home;
import com.vendor_marketplace.entity.HomeCategory;
import com.vendor_marketplace.exception.ResourceNotFoundException;
import com.vendor_marketplace.mapper.HomeCategoryMapper;
import com.vendor_marketplace.repository.HomeCategoryRepository;
import com.vendor_marketplace.services.HomeCategoryService;
import com.vendor_marketplace.utils.RedisUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

    private final HomeCategoryRepository homeCategoryRepository;
    private final HomeService homeService;
    private final RedisUtil redisUtil;


    @Override
    public HomeCategoryResponse createHomeCategory(HomeCategoryRequest homeCategoryRequest) {
        HomeCategory homeCategory = HomeCategory.builder()
                .name(homeCategoryRequest.getName())
                .categoryId(homeCategoryRequest.getCategoryId())
                .homeCategorySection(homeCategoryRequest.getHomeCategorySection())
                .image(homeCategoryRequest.getImage())
                .build();

        HomeCategory saved = homeCategoryRepository.save(homeCategory);
        HomeCategoryResponse response = HomeCategoryMapper.toHomeCategoryResponse(saved);

        redisUtil.saveToRedis(RedisUtil.homeCategory(saved.getId()), response, RedisUtil.ONE_DAY_CACHE_TTL);
        redisUtil.deleteFromRedis(RedisUtil.allHomeCategory());


        return response;
    }

    @Override
    public HomeCategoryResponse updateHomeCategory(Long homeCategoryId, UpdateHomeCategoryRequest req) {
        HomeCategory homeCategory = homeCategoryRepository.findById(homeCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Home Category Not Found"));

        Optional.ofNullable(req.getName())
                .filter(name -> !Objects.equals(name, homeCategory.getName()))
                .ifPresent(homeCategory::setName);

        Optional.ofNullable(req.getImage())
                .filter(image -> !Objects.equals(image, homeCategory.getImage()))
                .ifPresent(homeCategory::setImage);

        Optional.ofNullable(req.getCategoryId())
                .filter(id -> !Objects.equals(id, homeCategory.getCategoryId()))
                .ifPresent(homeCategory::setCategoryId);

        Optional.ofNullable(req.getHomeCategorySection())
                .ifPresent(homeCategory::setHomeCategorySection);

        HomeCategory updated = homeCategoryRepository.save(homeCategory);
        HomeCategoryResponse response = HomeCategoryMapper.toHomeCategoryResponse(updated);

        // update cache
        redisUtil.saveToRedis(RedisUtil.homeCategory(homeCategoryId), response, RedisUtil.ONE_DAY_CACHE_TTL);
        // also remove list cache
        redisUtil.deleteFromRedis(RedisUtil.allHomeCategory());

        return response;
    }

    @Override
    public void deleteHomeCategory(Long homeCategoryId) {
        HomeCategory homeCategory = homeCategoryRepository.findById(homeCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Home Category Not Found"));

        homeCategoryRepository.delete(homeCategory);
        redisUtil.deleteFromRedis(RedisUtil.allHomeCategory());
        redisUtil.deleteFromRedis(RedisUtil.homeCategory(homeCategoryId));
    }

    @Override
    @Transactional
    public Home createHomeCategories(List<HomeCategoryRequest> homeCategoryRequests) {
        List<HomeCategory> existing = homeCategoryRepository.findAll();

        if (existing.isEmpty()) {
            List<HomeCategory> newCategories = homeCategoryRequests.stream()
                    .map(req -> HomeCategory.builder()
                            .name(req.getName())
                            .categoryId(req.getCategoryId())
                            .homeCategorySection(req.getHomeCategorySection())
                            .image(req.getImage())
                            .build())
                    .toList();

            List<HomeCategory> saved = homeCategoryRepository.saveAll(newCategories);

            // cache each one
            saved.forEach(homeCategory ->
                    redisUtil.saveToRedis(RedisUtil.homeCategory(homeCategory.getId()), HomeCategoryMapper.toHomeCategoryResponse(homeCategory), RedisUtil.ONE_DAY_CACHE_TTL)
            );

            // invalidate list cache
            redisUtil.deleteFromRedis(RedisUtil.allHomeCategory());
            return homeService.createHomePageData(saved);
        }

        return homeService.createHomePageData(existing);
    }

    @Override
    public Home getHomeCategories() {

        Home cachedHome = redisUtil.get(RedisUtil.allHomeCategory(), Home.class);

        if (cachedHome != null) return cachedHome;

        List<HomeCategory> categories = homeCategoryRepository.findAll();
        Home home = homeService.createHomePageData(categories);

        redisUtil.saveToRedis(RedisUtil.allHomeCategory(), home, RedisUtil.ONE_DAY_CACHE_TTL);


        return home;
    }
}
