export interface ProductResponse {
  id?: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  stocks: number;
  discountInPercentage: number;
  createdAt: string; // ISO string from LocalDateTime or use Date
  images: string[];
  color: string;
  sizes: string;
  ratings?: number;
  seller?: ProductSeller;
  category?: ProductCategory;

  productReviews?: ProductReview[];
}

export interface ProductCategory {
  id: number;
  name: string;
  level: number;
  categoryId: string;
  parentCategory?: Partial<ProductCategory>; // recursive structure
}

export interface ProductSeller {
  id?: number;
  name: string;
  email: string;
  businessName: string
}

export interface ProductReview {
  id: number;
  productId: number;
  description: string;
  reviewUser: ReviewUser;
  rating: number;
  productImages?: string[];
  reviewCreatedAt: Date; // ISO string or use Date
}

export interface ProductSuggestionResponse {
  title: string,
  categoryId: string,
}



export interface ReviewUser {
  userId?: number;
  fullName: string;
  email?: string;
}

export interface PagedResponse {

  content: ProductResponse[],
  pageNumber: number,
  pageSize: number,
  totalElements: number,
  totalPages: number,
  last: boolean
}


export interface ProductRequest {
  title: string;
  description: string;
  category1: string,
  category2: string,
  category3: string,
  mrpPrice: number;
  sellingPrice: number;
  stocks: number;
  images: string[];
  color: string;
  sizes: string;
}

export interface ProductParamsRequest {

  categoryId?: string | null;
  brand?: string | null;
  color?: string | null;
  productTitle?: string | null;
  size?: string | null;
  stock?: string | null;
  sort?: string | null;
  maxPrice?: number | null;
  minPrice?: number | null;
  minDiscount?: number | null;
  pageNumber?: number | 1;
}
