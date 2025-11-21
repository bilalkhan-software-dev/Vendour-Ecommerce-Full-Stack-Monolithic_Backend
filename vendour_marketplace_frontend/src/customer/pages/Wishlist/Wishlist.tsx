import { useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Alert,
    AlertTitle,
    IconButton,
} from "@mui/material";
import {
    DeleteOutlineRounded,
    ErrorOutlineRounded,
    FavoriteBorderRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
    fetchUserWishlists,
    addProductToWishlist
} from "../../../redux/slice/customer/wishlistSlice";
import WishlistSkeleton from "../../../component/skeleton/WishlistSkeleton";
import BackToPreviousPage from "../../component/BackToPreviousPage/BackToPreviousPage";

const Wishlist = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const wishlist = useAppSelector((state) => state.wishlist);
    const auth = useAppSelector((state) => state.auth);

    // 🧭 Fetch user wishlist when logged in
    useEffect(() => {
        if (auth.user) {
            dispatch(fetchUserWishlists());
        }
    }, [dispatch, auth.user]);

    const handleRemoveFromWishlist = (productId: number) => {
        dispatch(addProductToWishlist({ productId: productId }));
    };

    if (wishlist.loading) return <WishlistSkeleton />;

    if (!auth.user) {
        return (
            <Box className="flex justify-center items-center min-h-[200px] md:mb-65">
                <Alert severity="warning" variant="outlined" sx={{ maxWidth: 500 }}>
                    <AlertTitle>Login Required</AlertTitle>
                    You must log in to see your wishlist, or refresh the page if you are already logged in.
                </Alert>
            </Box>
        );
    }

    if (wishlist.error) {
        return (
            <Box className="flex flex-col items-center justify-center py-20 text-center">
                <ErrorOutlineRounded color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" color="error" gutterBottom>
                    Oops! Something went wrong
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {wishlist.error || "Unable to fetch wishlist. Please try again later."}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(fetchUserWishlists())}
                    sx={{ textTransform: "none", px: 3, py: 1 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    const products = wishlist?.wishlists?.products || [];

    return (
        <Box className="p-4 min-h-screen mb-20 w-full overflow-y-auto">
            {/* Header */}
            <Box className="flex items-center justify-between mb-6">
                <BackToPreviousPage />
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary"
                    className="text-center flex-1"
                >
                    My Wishlists
                </Typography>
            </Box>

            {/* Wishlist Items */}
            {products.length > 0 ? (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                            <Card className="mt-6 "
                                sx={{
                                    height: "100%",
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-4px)",
                                    },
                                }}
                            >
                                <Box className="relative">
                                    <img
                                        src={product.images?.[0] || "/placeholder.jpg"}
                                        alt={product.title ?? "Product Image"}
                                        className="w-full aspect-[4/5] object-cover rounded-t-lg cursor-pointer"
                                        onClick={() => navigate(`/product-details/${product.id}/${product.category?.name}/${product.category?.categoryId}`)}
                                        loading="lazy"
                                    />

                                    <IconButton
                                        aria-label="Remove from wishlist"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveFromWishlist(product?.id ?? 0)}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            bgcolor: "white",
                                            "&:hover": { bgcolor: "white" },
                                        }}
                                    >
                                        <DeleteOutlineRounded />
                                    </IconButton>
                                </Box>

                                <CardContent className="flex flex-col gap-1">
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        noWrap
                                        title={product.title}
                                    >
                                        {product.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Rs. {product.sellingPrice.toLocaleString()}{" "}
                                        <span className="line-through text-gray-400 text-xs">
                                            Rs. {product.mrpPrice.toLocaleString()}
                                        </span>{" "}
                                        <span className="text-green-600 text-xs">
                                            ({product.discountInPercentage}% off)
                                        </span>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="flex flex-col items-center justify-center mt-20 text-center text-primary-color">
                    <FavoriteBorderRounded sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Your Wishlist is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Browse products and add some favorites!
                    </Typography>
                </Box>
            )
            }
        </Box >
    );
};

export default Wishlist;
