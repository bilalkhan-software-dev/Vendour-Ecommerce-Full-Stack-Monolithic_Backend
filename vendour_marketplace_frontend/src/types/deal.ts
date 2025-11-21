import type { HomeCategoryResponse } from "./homeCategory";

export interface DealRequest {
    discount: number;
    homeCategory: {
        id: string
    }
}

export interface DealResponse {
    id: number;
    discount: number;
    homeCategory: HomeCategoryResponse;
}

export interface DealSliceState{
    loading: boolean;
    error: string | null | undefined;
    deals: DealResponse[];
    deal: DealResponse | null;
}