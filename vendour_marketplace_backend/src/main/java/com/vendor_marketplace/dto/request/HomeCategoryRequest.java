package com.vendor_marketplace.dto.request;


import com.vendor_marketplace.entity.enums.HomeCategorySection;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeCategoryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Image is required")
    private String image;

    private String categoryId;

    @NotNull(message = "Home Category Section is required")
    private HomeCategorySection homeCategorySection;

}
