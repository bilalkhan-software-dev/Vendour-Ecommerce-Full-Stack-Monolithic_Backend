import type { ProductResponse } from "./product";
import type { UserResponse } from "./user";

export interface CartResponse {
    id?: number;
    user: Partial<UserResponse>;
    cartItems: CartItemResponse[];
    totalMrpPrice: number;
    totalSellingPrice: number;    
    totalItems: number;
    quantity: number;
    discount: number;

    // coupon related
    couponCode?: string;
    couponDiscountAmount: number;
    originalMrpPrice: number;
    originalSellingPrice: number;
}

export interface CartItemResponse {
    id: number;
    mrpPrice: number;
    sellingPrice: number;
    quantity: number;
    size?: string;
    userId: number;
    product: Partial<ProductResponse>
}

export interface AddItemToCartRequest {
    productId: number;
    quantity: number;
}

export interface CartSliceState {
    carts?: CartResponse | null,
    cartItem?: CartItemResponse | null,
    loading: boolean,
    couponApplied: boolean,
    error: string | null | undefined
}


export const sumCartItemMrpPrice = (cartItem: CartItemResponse[]) => {

    return cartItem.reduce((acc, item) => acc + item.mrpPrice, 0);
}

export const sumCartItemSellingPrice = (cartItem: CartItemResponse[]) => {

    return cartItem.reduce((acc, item) => acc + item.sellingPrice, 0);
}

export const calculateDiscount = (cartItems: CartItemResponse[]): number => {
    const totalMrpPrice = sumCartItemMrpPrice(cartItems);
    const totalSellingPrice = sumCartItemSellingPrice(cartItems);

    if (totalMrpPrice <= 0) return 0;
    if (totalSellingPrice < 0) return 0;
    if (totalSellingPrice > totalMrpPrice) return 0;

    const discount = totalMrpPrice - totalSellingPrice;
    return Math.floor((discount / totalMrpPrice) * 100); // match backend (int)
};


/**
 * Let's suppose we have this type of data:
 * const cart = [
    { mrpPrice: 100, sellingPrice: 80, quantity: 2 },
    { mrpPrice: 200, sellingPrice: 150, quantity: 1 },
    { mrpPrice: 50,  sellingPrice: 40, quantity: 3 }
    ];
 * Initial → acc = 0
 * Loop 1 (item = {100, 80, 2})
 * item.mrpPrice * item.quantity = 100 * 2 = 200
 * acc = 0 + 200 = 200
 * Loop 2 (item = {200, 150, 1})
 * item.mrpPrice * item.quantity = 200 * 1 = 200
 * acc = 200 + 200 = 400
 * Loop 3 (item = {50, 40, 3})
 * item.mrpPrice * item.quantity = 50 * 3 = 150
 * acc = 400 + 150 = 550
 * Final Output → 550
 * 
 * Same for sellingPrice and discount
 */



