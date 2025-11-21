import { CloseRounded, LocalOfferRounded, ShoppingCartRounded } from "@mui/icons-material";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CartItem from "./CartItem";
import { green, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, Button, IconButton, TextField, Tooltip, Zoom } from "@mui/material";
import PricingCard from "./PricingCard";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { fetchUserCart } from "../../../redux/slice/customer/cartSlice";
import { useNavigate } from "react-router-dom";
import { applyCoupon, removeCoupon } from "../../../redux/slice/customer/cartSlice";
import type { CartItemResponse } from "../../../types/cart";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import type { SnackbarProps } from "../../../types/props";
import CartSkeleton from "../../../component/skeleton/CartSkeleton";

const Cart = () => {



    const [couponCode, setCouponCode] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { cart, auth } = useAppSelector(store => store);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });
    const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setSnackbar({ open: true, message, severity });
    };




    const coupon_code = cart.carts?.couponCode ?? '';


    const handleCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCode(e.target.value);
    }

    const handleApplyCoupon = async () => {
        const result = await dispatch(
            applyCoupon({
                apply: "true",
                couponCode: couponCode,
            })
        );

        if (applyCoupon.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Coupon applied successfully.",
                severity: "success",
            });
            // localStorage.setItem("appliedCoupon: ", couponCode);
        } else if (applyCoupon.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to apply the coupon. Please try again.",
                severity: "error",
            });
            // localStorage.removeItem("appliedCoupon");
        }
    };

    const handleRemoveCoupon = async () => {
        const result = await dispatch(
            removeCoupon({ apply: "false", couponCode: coupon_code })
        );

        if (removeCoupon.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Coupon removed successfully.",
                severity: "success",
            });
        } else if (removeCoupon.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to remove the coupon. Please try again.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        const fetchCart = async () => {
            const result = await dispatch(fetchUserCart());

            if (fetchUserCart.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Your cart was retrieved successfully.",
                    severity: "success",
                });
            } else if (fetchUserCart.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to load your cart. Please try again later.",
                    severity: "error",
                });
            }
        };

        fetchCart();
    }, [dispatch]);

    if (!auth.user) {
        return (
            <div className="flex justify-center items-center min-h-[200px] md:mb-65">
                <Alert severity="warning" variant="outlined" sx={{ maxWidth: 500 }}>
                    <AlertTitle>Login Required</AlertTitle>
                    You must have to log in see cart, or refresh the page if you are
                    already logged in.
                </Alert>
            </div>
        );
    }

    if (cart.loading) {
        return (
            <CartSkeleton />
        );
    }









    return (
        <>
            <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen w-full'>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Cart Item section */}
                    <div className="lg:col-span-2 space-y-3 overflow-y-auto hide-scrollbar max-h-[80vh]">
                        {
                            cart.carts && cart.carts?.cartItems.length > 0 ?
                                cart.carts?.cartItems.map((item: CartItemResponse, index: number) =>
                                    <CartItem item={item} key={index} showSnackbar={showSnackbar} />
                                )
                                :
                                <div className="light-thin-border md:text-4xl rounded-md flex flex-col items-center justify-center py-10 text-gray-500">
                                    <ShoppingCartRounded sx={{ fontSize: 40, color: "gray" }} />
                                    <p className="mt-2 text-md md:text-3xl font-medium">Your cart is currently empty.</p>
                                </div>
                        }
                    </div>
                    {/* Right Section Apply Coupon and Place Order -> Checkout */}

                    {
                        cart.carts && cart.carts.cartItems.length > 0 ?
                            < div className="lg:col-span-1 text-sm space-y-3">
                                <div className="border border-gray-200/100 py-4 rounded-md px-5 space-y-5">
                                    <div className="flex gap-3 text-sm items-center">
                                        <div className="flex gap-3 text-sm items-center">
                                            <LocalOfferRounded sx={{ color: green[400], fontSize: "17px" }} />
                                        </div>
                                        <span>Apply Coupons</span>
                                    </div>

                                    {cart.carts && !cart.couponApplied ?
                                        <div className="flex justify-between items-center">
                                            <TextField
                                                onChange={handleCouponCode}
                                                name="couponCode"
                                                fullWidth
                                                value={couponCode}
                                                size="small"
                                                placeholder="Enter Code"
                                                variant="outlined" />

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                className="rounded-md"
                                                onClick={handleApplyCoupon}
                                                sx={{
                                                    marginLeft: "10px",
                                                    height: "40px",
                                                    borderRadius: "5px"

                                                }}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                        :
                                        <div className="flex">
                                            <div className="p-1 pl-5 pr-3 border border-gray-200/100 rounded-md flex items-center gap-2">
                                                <span className="text-gray-800 italic font-semibold">{coupon_code}</span>
                                                <Tooltip title='Remove Coupon'
                                                    slots={{
                                                        transition: Zoom,
                                                    }}
                                                >
                                                    <IconButton size="small"
                                                        onClick={handleRemoveCoupon}
                                                    >
                                                        <CloseRounded className="text-red-600" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    }
                                </div>


                                {/* Pricing Card */}
                                <div className="light-thin-border space-y-4 rounded-md">
                                    {cart.carts && <PricingCard cart={cart.carts} />}
                                    <div className="px-5 py-2">
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                            onClick={() => navigate("/checkout")}
                                        >
                                            Checkout
                                        </Button>
                                    </div>
                                </div>

                                {/* Add from wishlist */}
                                <div className="flex justify-between light-thin-border rounded-md space-y-2 px-4 items-center">
                                    <p className="text-gray-800 pt-1 opacity-30 text-center">Add From Wishlishts</p>
                                    <IconButton size="small" >
                                        <FavoriteRoundedIcon sx={{ color: red[700] }} />
                                    </IconButton>
                                </div>
                            </div>
                            :
                            <div className="">
                            </div>
                    }
                </div>
            </div >
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default Cart;