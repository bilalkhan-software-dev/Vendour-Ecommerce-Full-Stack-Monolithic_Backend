import type { ProductResponse } from "./product";
import type { UserResponse } from "./user";

export interface ReviewResponse {
  id: number;
  description: string;
  rating: number;
  reviewDate: Date; // ISO string from LocalDateTime
  productImages: string[];
  product: Partial<ProductResponse>;
  user: Partial<UserResponse>;
}

export interface ReviewSliceState {
  loading: boolean;
  error: string | null;
  productReviews: ReviewResponse[];
  myReviews: ReviewResponse[];
  review: ReviewResponse | null;
}

export interface AddReviewRequest {
  description: string;
  rating: number;
  productImages: string[];
}
