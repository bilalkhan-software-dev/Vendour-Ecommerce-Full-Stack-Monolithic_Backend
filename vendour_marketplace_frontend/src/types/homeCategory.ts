import type { DealResponse } from "./deal";

export type HomeCategorySection =
    | "ELECTRONICS_CATEGORIES"
    | "GRID"
    | "SHOP_BY_CATEGORIES"
    | "DEALS";

export interface HomeCategoryRequest {
    name?: string;
    image: string;
    categoryId?: string;
    homeCategorySection?: HomeCategorySection;
}

export interface HomeCategoryResponse extends HomeCategoryRequest {
    id: number;
}

export interface HomeData {
    id?: number;
    grid: HomeCategoryResponse[];
    shopByCategory: HomeCategoryResponse[];
    electronicCategories: HomeCategoryResponse[];
    dealCategories: HomeCategoryResponse[];
    deals: DealResponse[];
}


export interface CustomerHomeCategorySlice {
    loading: boolean;
    error: string | null | undefined;
    homeData: HomeData | null;
}

export interface AdminHomeCategorySlice {
    loading: boolean;
    error: string | null | undefined;
    homePageCategories: HomeData | null;
    homeCategories: HomeCategoryResponse[];
    homeCategory: HomeCategoryResponse | null;
}

