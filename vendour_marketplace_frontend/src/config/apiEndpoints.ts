import { APP_BASE_URL } from "./api";

// Auth Endpoints
export const SENT_SIGNIN_UP_OTP_REQUEST_ENDPOINT = `${APP_BASE_URL}/auth/send/otp`;
export const LOGIN_REQUEST_ENDPOINT = `${APP_BASE_URL}/auth/login`;
export const SELLER_LOGIN_REQUEST_ENDPOINT = `${APP_BASE_URL}/auth/seller/login`;
export const SIGNUP_REQUEST_ENDPOINT = `${APP_BASE_URL}/auth/register`;

// ================================================================ Seller Endpoints =============================================================== \\
// login signuo,profile related
export const SELLER_REGISTER_ENDPOINT = `${APP_BASE_URL}/sellers/register`;
export const SELLER_PROFILE_ENDPOINT = `${APP_BASE_URL}/sellers/profile`;
export const VERIFY_SELLER_EMAIL_ENDPOINT = `${APP_BASE_URL}/sellers/verify-email/:email?otp=:otp`;
export const RESEND_SELLER_EMAIL_VERIFY_LINK_ENDPOINT = `${APP_BASE_URL}/sellers/resend/email/verification/link/:email`;
export const SELLER_PROFILE_UPDATE_ENDPOINT = `${APP_BASE_URL}/sellers/update`;
// seller resport endpoint
export const SELLER_REPORT_ENDPOINT = `${APP_BASE_URL}/sellers/report`;
// product related
export const SELLER_PRODUCT_ADD_ENDPOINT = `${APP_BASE_URL}/sellers/product/add`;
export const SELLER_PRODUCT_UPDATE_ENDPOINT = `${APP_BASE_URL}/sellers/product/update`;
export const SELLER_PRODUCT_DELETE_ENDPOINT = `${APP_BASE_URL}/sellers/product/delete`;
export const SELLER_PRODUCTS_ENDPOINT = `${APP_BASE_URL}/sellers/product/`;
// order related
export const SELLER_ORDERS_ENDPOINT = `${APP_BASE_URL}/seller/orders/`;
export const SELLER_UPDATE_ORDER_STATUS_ENDPOINT = `${APP_BASE_URL}/seller/orders`;
// transaction related
export const SELLER_TRANSACTIONS_ENDPOINT = `${APP_BASE_URL}/transaction/seller`;


// =========================================================== Customer => User Endpoints ========================================================== \\
//  info related 
export const USER_PROFILE_ENDPOINT = `${APP_BASE_URL}/user/profile`;
export const USER_PROFILE_UPDATE_ENDPOINT = `${APP_BASE_URL}/user/update`;
//  product related 
export const USER_PRODUCT_SEARCH_ENDPOINT = `${APP_BASE_URL}/product/search`;
export const USER_SIMILAR_PRODUCT_SEARCH_ENDPOINT = `${APP_BASE_URL}/product/similar/:productId`;
export const USER_PRODUCT_DETAIL_BY_ID_ENDPOINT = `${APP_BASE_URL}/product`;
export const USER_PRODUCTS_FILTER_ENDPOINT = `${APP_BASE_URL}/product/all/filter`;
//  review related 
export const USER_REVIEW_ADD_ON_PRODUCT_ENDPOINT = `${APP_BASE_URL}/review/create/product`;
export const USER_REVIEW_UPDATE_ON_PRODUCT_ENDPOINT = `${APP_BASE_URL}/review/update`;
export const USER_REVIEW_DELETE_ON_PRODUCT_ENDPOINT = `${APP_BASE_URL}/review/delete`;
export const USERS_REVIEWS_ON_PRODUCT_ENDPOINT = `${APP_BASE_URL}/review/product`;
export const MY_REVIEWS_ENDPOINT = `${APP_BASE_URL}/review/reviews/user`;
export const USER_REVIEW_DETAIL_ON_PRODUCT_ENDPOINT = `${APP_BASE_URL}/review`;
//  cart related 
export const USER_ADD_PRODUCT_TO_CART_ENDPOINT = `${APP_BASE_URL}/cart/add/item`;
export const USER_UPDATE_CARTITEM_ENDPOINT = `${APP_BASE_URL}/cart/update/item`;
export const USER_DELETE_CARTITEM_ENDPOINT = `${APP_BASE_URL}/cart/delete/item`;
export const USER_CARTS_ENDPOINT = `${APP_BASE_URL}/cart/user/`;
//  coupon related 
export const APPLY_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/apply`;
export const REMOVE_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/remove`;
//  order related 
export const USER_ORDER_PLACE_STRIPE_ENDPOINT = `${APP_BASE_URL}/orders/place/stripe`;
export const USER_ORDER_PLACE_JAZZCASH_ENDPOINT = `${APP_BASE_URL}/orders/place/jazzcash`;
export const USER_ORDERS_ENDPOINT = `${APP_BASE_URL}/orders/users/`;
export const USER_ORDER_CANCEL_ENDPOINT = `${APP_BASE_URL}/orders/cancel`;
export const GET_ORDER_DETAIL_BY_ORDER_ID_ENDPOINT = `${APP_BASE_URL}/orders`;
export const GET_ORDER_ITEM_DETAIL_BY_ORDERITEM_ID_ENDPOINT = `${APP_BASE_URL}/orders/item`;
//  verify stripe payment success or failed related
export const PAYMENT_CALLBACK_SUCCESS_VERIFY_ENDPOINT = '/api/payments/stripe/success';
export const PAYMENT_CALLBACK_CANCEL_ENDPOINT = '/api/payments/stripe/cancel';
//  wishlist related
export const USER_ADD_PRODUCT_TO_WISHLIST_ENDPOINT = `${APP_BASE_URL}/wishlist/add/product`;
export const USER_WISHLISTS_ENDPOINT = `${APP_BASE_URL}/wishlist/user`;
// Home Categories
export const FETCH_HOME_CATEGORIES_ENDPOINT = `${APP_BASE_URL}/home/`;

// ================================================================ Admin Endpoints =============================================================== \\
//  coupon related 
export const CREATE_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/create`;
export const DELETE_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/delete/:couponId`;
export const UPDATE_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/update/:couponId`;
export const GET_ALL_COUPON_ENDPOINT = `${APP_BASE_URL}/coupon/coupons`;
//  transaction related
export const GET_ALL_TRANSACTIONS_ENDPOINT = `${APP_BASE_URL}/transaction/`;
export const GET__ALL_TRANSACTIONS_OF_THE_SELLER_ENDPOINT = `${APP_BASE_URL}/transaction/seller`;
//  seller related
export const GET_ALL_SELLERS_ENDPOINT = `${APP_BASE_URL}/admin/sellers/`;
export const UPDATE_SELLER_ACCOUNT_STATUS_ENDPOINT = `${APP_BASE_URL}/admin/seller/update-status/:sellerId`;
export const GET_SELLER_DETAIL_BY_ID_ENDPOINT = `${APP_BASE_URL}/admin/seller/detail/id/:sellerId`;
export const GET_ALL_SELLERS_BY_ACCOUNT_STATUS_ENDPOINT = `${APP_BASE_URL}/admin/seller/filter/:accountStatus`;
export const SELLER_REPORT_BY_ID_ENDPOINT = `${APP_BASE_URL}/admin/seller/report/:sellerId`;
// home page customization
export const CREATE_HOME_CATEGORIES_ENDPOINT = `${APP_BASE_URL}/home/admin/create/categories`;
export const CREATE_HOME_CATEGORY_ENDPOINT = `${APP_BASE_URL}/home/admin/create/category`;
export const UPDATE_HOME_CATEGORIES_ENDPOINT = `${APP_BASE_URL}/home/admin/update/:homeCategoryId`;
export const DELETE_HOME_CATEGORIY_ENDPOINT = `${APP_BASE_URL}/home/admin/delete/:homeCategoryId`;
// deal
export const CREATE_DEAL_ENDPOINT = `${APP_BASE_URL}/deal/admin/create`;
export const UPDATE_DEAL_ENDPOINT = `${APP_BASE_URL}/deal/admin/update/:dealId`;
export const DELETE_DEAL_ENDPOINT = `${APP_BASE_URL}/deal/admin/delete/:dealId`;
export const ALL_DEALS_ENDPOINT = `${APP_BASE_URL}/deal/all`;


export const ALL_HOME_CATEGORIES_ENDPOINT = `${APP_BASE_URL}/home/`;




// chatbot related
export const ASK_AI_PRODUCT_DETAILS_ENDPOINT = `${APP_BASE_URL}/chat/ask/ai/detail/:productId?question=:question`;
export const ASK_AI_WITH_LOGIN_ENDPOINT = `${APP_BASE_URL}/chat/ask/ai/:question`;
export const ASK_AI_PUBLIC_ENDPOINT = `${APP_BASE_URL}/chat/ask/ai?question=:question`;





