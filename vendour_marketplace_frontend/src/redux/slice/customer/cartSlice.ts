import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { api } from "../../../config/api";
import { calculateDiscount, sumCartItemMrpPrice, sumCartItemSellingPrice, type AddItemToCartRequest, type CartItemResponse, type CartResponse, type CartSliceState } from "../../../types/cart";
import { APPLY_COUPON_ENDPOINT, REMOVE_COUPON_ENDPOINT, USER_ADD_PRODUCT_TO_CART_ENDPOINT, USER_CARTS_ENDPOINT, USER_DELETE_CARTITEM_ENDPOINT, USER_UPDATE_CARTITEM_ENDPOINT } from "../../../config/apiEndpoints";
import type { NavigateFunction } from "react-router-dom";


export const fetchUserCart = createAsyncThunk<
    CartResponse,
    void,
    { rejectValue: string }
>(
    "/cart/fetchUserCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${USER_CARTS_ENDPOINT}`);
            console.log("User Cart: ", response.data.data)
            return response.data.data as CartResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to Fetch User Cart. Please try again later.");
        }
    }
);

export const addProductToCart = createAsyncThunk<
    CartItemResponse,
    AddItemToCartRequest,
    { rejectValue: string }
>(
    "/cart/addProductToCart",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post(`${USER_ADD_PRODUCT_TO_CART_ENDPOINT}`, payload);
            console.log("Add Product to cart: ", response.data.data)
            return response.data.data as CartItemResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to add product to cart. Please try again later!");
        }
    }
);

export const updateCartItem = createAsyncThunk<
    CartItemResponse,
    { request: { quantity: number }, cartItemId: number },
    { rejectValue: string }
>(
    "/cart/updateCartItem",
    async ({ request, cartItemId }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${USER_UPDATE_CARTITEM_ENDPOINT}/${cartItemId}`, request);
            console.log("Update cart item: ", response.data.data)
            return response.data.data as CartItemResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to add product to cart. Please try again later!");
        }
    }
);

export const deleteCartItem = createAsyncThunk<
    { message: string },           // fulfilled payload is the deleted item id
    { cartItemId: number },                        // argument is just a number
    { rejectValue: string }
>(
    "/cart/deleteCartItem",
    async ({ cartItemId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${USER_DELETE_CARTITEM_ENDPOINT}/${cartItemId}`);
            return response.data.message;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to delete cart item. Please try again later!");
        }
    }
);



export const applyCoupon = createAsyncThunk<
    CartResponse,
    { apply: string,couponCode: string },
    { rejectValue: string }
>(
    "/cart/applyCoupon",
    async ({ apply, couponCode }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${APPLY_COUPON_ENDPOINT}`, null, {
                params: {
                    apply, couponCode
                },
            });
            console.log("Apply Coupon to cart: ", response.data.data);
            return response.data.data as CartResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to apply coupon to cart. Please try again later!");
        }
    }
);
export const removeCoupon = createAsyncThunk<
    CartResponse,
    { apply: string, couponCode: string },
    { rejectValue: string }
>(
    "/cart/removeCoupon",
    async ({ apply, couponCode }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${REMOVE_COUPON_ENDPOINT}`, null, {
                params: {
                    apply, couponCode
                },
            });
            console.log("Removing Coupon from cart: ", response.data.data);
            return response.data.data as CartResponse;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to remove coupon from cart. Please try again later!");
        }
    }
);

const initialState: CartSliceState = {
    carts: null,
    cartItem: null,
    couponApplied: false,
    loading: false,
    error: null
}

export const logoutCart = createAsyncThunk<
    void, // return type
    { navigate: NavigateFunction }, // payload type
    { rejectValue: string } // thunkApi config
>(
    "/cart/logout",
    async ({ navigate }, { rejectWithValue }) => {
        try {
            localStorage.removeItem("jwt");
            navigate("/");
            return;
        } catch (error) {
            console.error("Error: ", error);
            return rejectWithValue("Failed to logout");
        }
    }
);


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
            state.loading = false;
            state.carts = action.payload;
        });
        builder.addCase(fetchUserCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch user cart';
        });

        builder.addCase(addProductToCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addProductToCart.fulfilled, (state, action: PayloadAction<CartItemResponse>) => {
            state.loading = false;

            if (state.carts?.cartItems) {
                state.carts.cartItems.push(action.payload);
            } else {
                state.carts = { ...state.carts, cartItems: [action.payload] } as any;
            }

            state.cartItem = action.payload;
        });
        builder.addCase(addProductToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to add product to cart!';
        });

        builder.addCase(updateCartItem.pending, (state) => {
            state.error = null;
            state.loading = true;
        });
        builder.addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItemResponse>) => {
            state.loading = false;

            if (state.carts) {
                // 1. update the specific cart item in the array
                state.carts.cartItems = state.carts.cartItems.map(item =>
                    item.id === action.payload.id ? action.payload : item
                );

                // 2. recalc totals using the updated cartItems array
                state.carts.totalMrpPrice = sumCartItemMrpPrice(state.carts.cartItems);
                state.carts.totalSellingPrice = sumCartItemSellingPrice(state.carts.cartItems);
                state.carts.discount = calculateDiscount(state.carts.cartItems);

                // (optional) recalc totalItems if it's meant to be sum of all quantities
                state.carts.totalItems = state.carts.cartItems.reduce((acc, item) => acc + item.quantity, 0);
            }
        });
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to update cart item quantity!';
        });

        builder.addCase(deleteCartItem.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteCartItem.fulfilled, (state, action) => {
            state.loading = false;

            // Removing delete cart item from redux state for instance consistency no need to refresh
            if (state.carts?.cartItems) {
                state.carts.cartItems = state.carts.cartItems.filter(
                    (item) => item.id !== action.meta.arg.cartItemId
                );
                // updating prices for consistency
                const updatedTotalMrpPrice = sumCartItemMrpPrice(state.carts.cartItems || []);
                const updatedTotalSellingPrice = sumCartItemSellingPrice(state.carts.cartItems || []);
                const totalDiscount = calculateDiscount(state.carts.cartItems || []);
                state.carts.totalMrpPrice = updatedTotalMrpPrice;
                state.carts.totalSellingPrice = updatedTotalSellingPrice;
                state.carts.discount = totalDiscount;
            }
        });
        builder.addCase(deleteCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to add product to cart!';
        });

        builder.addCase(applyCoupon.pending, ((state) => {
            state.loading = true;
        }));
        builder.addCase(applyCoupon.fulfilled, ((state, action) => {
            state.loading = false;
            state.carts = action.payload;
            state.couponApplied = true;
        }));
        builder.addCase(applyCoupon.rejected, ((state, action) => {
            state.loading = false;
            state.error = action.payload;
        }));

        builder.addCase(removeCoupon.pending, ((state) => {
            state.loading = true;
        }));
        builder.addCase(removeCoupon.fulfilled, ((state, action) => {
            state.loading = false;
            state.carts = action.payload;
            state.couponApplied = false;
        }));
        builder.addCase(removeCoupon.rejected, ((state, action) => {
            state.loading = false;
            state.error = action.payload;
        }));

        builder.addCase(logoutCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logoutCart.fulfilled,
            () => initialState);
        builder.addCase(logoutCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    }
});

export default cartSlice.reducer;





