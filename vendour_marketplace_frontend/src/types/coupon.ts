import type { UserResponse } from "./user";

export interface CouponResponse {
    couponId: number;
    code: string;
    discountInPercentage: number;
    startDate: string;          // LocalDate from Java → ISO string in JSON
    endDate: string;
    minimumOrderValue: number;
    active: boolean;
    usedByUsers: UserResponse[];
}

export interface CouponRequest {
    minimumOrderValue: number;
    startDate: string | null;
    endDate: string | null;
    code: string | null;
    isActive?: boolean;
    discountInPercentage: number;
}


// Admin functionality
export interface CouponSliceState {
    coupons: CouponResponse[];
    loading: boolean;
    coupon: CouponResponse | null;
    error: string | undefined | null;
    isCouponCreated: boolean;
}
