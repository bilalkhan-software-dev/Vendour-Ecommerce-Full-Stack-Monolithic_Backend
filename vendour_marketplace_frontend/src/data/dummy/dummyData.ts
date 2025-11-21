import type { CartItemResponse, CartResponse } from "../../types/cart";
import type { OrderItemResponse, PaymentDetailsResponse, OrderResponse } from "../../types/order";
import type { ProductResponse } from "../../types/product";
import type { ReviewResponse } from "../../types/review";
import type { Address } from "../../types/seller";
import type { UserResponse } from "../../types/user";

// Dummy user
export const dummyUser: UserResponse = {
    id: 1,
    fullName: "Bilal Khan",
    email: "bilal@example.com",
    role: "CUSTOMER",
    address: [],
    usedCoupons: [],
};

// Dummy product
export const dummyProduct: ProductResponse = {
    id: 2001,
    title: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and step counter.",
    mrpPrice: 80,
    sellingPrice: 65,
    quantity: 100,
    discountInPercentage: 18,
    createdAt: new Date().toISOString(),
    images: [
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    ],
    color: "Black",
    sizes: "Standard",
    ratings: 4.2,
};

// Dummy Cart Item
export const dummyCartItem: CartItemResponse = {
    id: 301,
    mrpPrice: dummyProduct.mrpPrice,
    sellingPrice: dummyProduct.sellingPrice,
    quantity: 2,
    size: "M",
    userId: dummyUser.id,
    product: { id: dummyProduct.id, title: dummyProduct.title, images: dummyProduct.images },
};

// Dummy Cart
export const dummyCart: CartResponse = {
    id: 101,
    user: { id: dummyUser.id, fullName: dummyUser.fullName },
    cartItems: [dummyCartItem],
    totalMrpPrice: dummyCartItem.mrpPrice * dummyCartItem.quantity,
    totalSellingPrice: dummyCartItem.sellingPrice * dummyCartItem.quantity,
    totalItems: 1,
    quantity: 2,
    discount: 15,
    couponCode: "SUMMER15",
};

// Dummy Order Item
export const dummyOrderItem: OrderItemResponse = {
    orderItemId: 401,
    size: 42,
    quantity: 1,
    mrpPrice: dummyProduct.mrpPrice,
    sellingPrice: dummyProduct.sellingPrice,
    userId: dummyUser.id,
    product: {
        id: dummyProduct.id,
        title: dummyProduct.title,
        description: dummyProduct.description,
        images: dummyProduct.images,
    },
};

// Dummy Payment Details
export const dummyPaymentDetails: PaymentDetailsResponse = {
    paymentMethod: "Stripe",
    stripePaymentLinkId: "plink_123456789",
    jazzCashTransactionReferenceNumber: "",
    amount: dummyProduct.sellingPrice,
    paymentStatus: "SUCCESS",
};

// Dummy Address
export const dummyAddress: Address = {
    id: 1,
    address: "123 Main Street",
    city: "Lahore",
    state: "Punjab",
    pinCode: "54000",
    locality: "Pakistan",
};

// Dummy Order
export const dummyOrder: OrderResponse = {
    id: 501,
    orderId: "ORD-2025-0001",
    sellerId: 100,
    totalMrpPrice: dummyProduct.mrpPrice,
    totalSellingPrice: dummyProduct.sellingPrice,
    discount: 15,
    orderStatus: "CONFIRMED",
    paymentStatus: "PAID",
    orderDate: new Date("2025-09-20T14:00:00Z").toISOString(),
    deliveryDate: new Date("2025-09-25T14:00:00Z").toISOString(),
    user: { id: dummyUser.id, fullName: dummyUser.fullName, email: dummyUser.email },
    orderItems: [dummyOrderItem],
    address: dummyAddress,
    paymentDetails: dummyPaymentDetails,
};


export const dummyReviews: ReviewResponse[] = [
    {
        id: 5001,
        description: "Great sound quality, very comfortable to wear!",
        rating: 5,
        reviewDate: new Date("2025-01-15T10:30:00Z"),
        productImages: [
            "https://images.unsplash.com/photo-1606813902771-d9c3e3b499ad",
        ],
        product: { id: dummyProduct.id, title: dummyProduct.title },
        user: { id: dummyUser.id, fullName: dummyUser.fullName },
    },
    {
        id: 5002,
        description: "Battery life could be better, but overall good.",
        rating: 3,
        reviewDate: new Date("2025-02-01T14:45:00Z"),
        productImages: [
            "https://images.unsplash.com/photo-1592124496811-99f45c0dfd8c",
        ],
        product: { id: dummyProduct.id, title: dummyProduct.title },
        user: { id: 2, fullName: "Ayesha Noor" },
    },
    {
        id: 5003,
        description: "Decent value for the price. Sleek design.",
        rating: 4,
        reviewDate: new Date("2025-03-10T09:20:00Z"),
        productImages: [
            "https://images.unsplash.com/photo-1626382022478-fb7e5f1d90c8",
        ],
        product: { id: dummyProduct.id, title: dummyProduct.title },
        user: { id: 3, fullName: "Ahmed Raza" },
    },
];