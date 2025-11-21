import type { Address } from "./seller";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  address?: Address[],
  usedCoupons?: UsedCouponResponse[];
}


export interface UsedCouponResponse {
  code: string | null | undefined;
  discountInPercentage: number | 0 | null;
  minimumOrderValue: number | 0 | null;
}
