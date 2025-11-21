import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import sellerReducer from "./slice/seller/sellerSlice"
import sellerProductSlice from "./slice/seller/sellerProductSlice";
import productSlice from "./slice/customer/productSlice";
import authSlice from "./slice/authSlice";
import homePageSlice from "./slice/homePageSlice";
import cartSlice from "./slice/customer/cartSlice";
import orderSlice from "./slice/customer/orderSlice";
import reviewSlice from "./slice/customer/reviewSlice";
import wishlistSlice from "./slice/customer/wishlistSlice";
import chatbotSlice from "./slice/customer/chatBotSlice";
import sellerAuthSlice from "./slice/seller/sellerAuthSlice";
import sellerOrderSlice from "./slice/seller/sellerOrderSlice";
import adminSellerSlice from "./slice/admin/adminSellerSlice";
import couponSlice from "./slice/admin/couponSlice";
import dealSlice from "./slice/admin/dealSlice";
import adminHomePageCustomizationSlice from "./slice/admin/adminHomePageCustomizationSlice";


const rootReducer = combineReducers({
  
  // Seller Slice 
  seller: sellerReducer,
  sellerProduct: sellerProductSlice,
  sellerAuth: sellerAuthSlice,
  sellerOrder: sellerOrderSlice,

  // Customer Slice
  product: productSlice,
  auth: authSlice,
  cart: cartSlice,
  order: orderSlice,
  review: reviewSlice,
  wishlist: wishlistSlice,
  home: homePageSlice,
  chatbot: chatbotSlice,

  // Admin Slice
  adminSeller: adminSellerSlice,
  deal: dealSlice,
  adminHomeCustomization: adminHomePageCustomizationSlice,
  coupon: couponSlice,
});

// Create store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Types for state & dispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
