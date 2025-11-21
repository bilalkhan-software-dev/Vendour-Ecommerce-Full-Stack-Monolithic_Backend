import type { ProductResponse } from "./product";
import type { UserResponse } from "./user";


export interface WishlistResponse {
    wishlistId: number;
    user: UserResponse;
    products: ProductResponse[];
}


export interface WishlistSliceState {
    loading: boolean;
    error: string | null;
    wishlists: WishlistResponse | null;
    wishlist: WishlistResponse | null;

}

