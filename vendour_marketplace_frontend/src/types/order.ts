import type { ProductResponse } from "./product";
import type { Address, SellerResponse } from "./seller";
import type { UserResponse } from "./user";


export interface OrderResponse {
    id: number;
    orderId: string;
    sellerId: number;
    totalMrpPrice: number;
    totalSellingPrice: number;
    discount: number;
    orderStatus: string;
    paymentStatus: string;
    orderDate: string;
    deliveryDate: string;
    user: UserResponse;
    orderItems: OrderItemResponse[];
    address: Address;
    paymentDetails: PaymentDetailsResponse;

    // coupon related
    couponCode: string;
    couponDiscountAmount: number;
    originalSellingPrice: number;

}


export interface PaymentDetailsResponse {
    paymentMethod: string;
    stripePaymentLinkId: string;
    jazzCashTransactionReferenceNumber: string;
    amount: number;
    paymentStatus: string;
}





export interface OrderItemResponse {
    orderItemId: number;
    size: number;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
    product: ProductResponse;

    // coupon related
    couponDiscountAmount: number;
    originalSellingPrice: number;

}

export interface OrderSliceState {
    loading: boolean;
    message: string | null;
    error: string | null;
    orders: OrderResponse[] | null;
    orderItem: OrderItemResponse[] | null;
    currentOrderItem: OrderItemResponse | null
    currentOrder: OrderResponse | null; // order detail
    stripePaymentResponse: StripePaymentResponse | null;
    orderCancelled: boolean;
    jazzCashPaymentVerified: boolean;
}

export interface TransactionResponse {
    id: number;
    seller: SellerResponse;
    customer: UserResponse;
    order: OrderResponse;
    createdAt: string;
}

export interface SellerOrderSliceState {
    loading: boolean;
    orders: OrderResponse[] | null;
    order: OrderResponse | null;
    transactions: TransactionResponse[] | null;
    error: string | null;
    message: string | null;
}

export interface StripePaymentResponse {
    paymentId: string,
    paymentUrl: string // using this url for redirect to customer to stripe website
}