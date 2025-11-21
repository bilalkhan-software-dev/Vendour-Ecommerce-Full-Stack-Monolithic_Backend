package com.vendor_marketplace.entity;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Home {

    @Builder.Default
    private List<HomeCategory> shopByCategory = new ArrayList<>();

    @Builder.Default
    private List<HomeCategory> grid = new ArrayList<>();

    @Builder.Default
    private List<HomeCategory> electronicCategories = new ArrayList<>();

    @Builder.Default
    private List<HomeCategory> dealCategories = new ArrayList<>();

    @Builder.Default
    private List<Deal> deals = new ArrayList<>();


}
