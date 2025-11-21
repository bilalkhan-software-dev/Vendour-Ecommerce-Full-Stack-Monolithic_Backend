import {
    AddRounded,
    AddShoppingCartRounded,
    ErrorOutlineRounded,
    FavoriteBorderRounded,
    LocalShippingRounded,
    RateReviewRounded,
    RemoveRounded,
    ShieldRounded,
    WalletRounded,
    WorkspacePremiumRounded,
} from "@mui/icons-material";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { Box, Button, Chip, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { green, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ReviewCard from "../Review/ReviewCard";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productDetailById, similarProducts } from "../../../redux/slice/customer/productSlice";
import { addProductToWishlist } from "../../../redux/slice/customer/wishlistSlice";
import { addProductToCart } from "../../../redux/slice/customer/cartSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { placeHolderImage } from "../../../data/account/customerAccount";
import ProductDetailsSkeleton from "../../../component/skeleton/ProductDetailsSkeleton";
import SimilarProductCard from "../Similar Product/SimilarProductCard";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState<number>(0);
    const navigate = useNavigate();
    const { product, auth, cart, wishlist } = useAppSelector((store) => store);
    const dispatch = useAppDispatch();
    const { productId } = useParams<{ productId: string }>();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const relatedProduct = useAppSelector(store => store.product.similarProducts);


    useEffect(() => {
        dispatch(similarProducts({ productId: Number(productId) }))
    }, [productId, dispatch])


    useEffect(() => {
        dispatch(productDetailById({ productId: Number(productId) }));
    }, [dispatch, productId]);

    const handleActiveImage = (index: number) => {
        setActiveImage(index);
    };

    const handleAddToCart = async (values: {
        productId: number;
        quantity: number;
    }) => {


        if (!auth.user) {
            setSnackbar({
                open: true,
                message: "Login required to add this product to cart!",
                severity: "error",
            });
            return;
        }

        if (quantity <= 0) {
            setSnackbar({
                open: true,
                message: "Item quantity must be greater than 0",
                severity: "error",
            });
            return;
        }

        const result = await dispatch(addProductToCart(values))
        if (addProductToCart.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Product added to cart successfully.",
                severity: "success",
            });
        } else if (addProductToCart.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to add the product to the cart. Please try again.",
                severity: "error",
            });
        }
        console.log("Add to Cart: ", values);
    };



    const handleAddToWishlist = async (values: { productId: number }) => {
        if (!auth.user) {
            setSnackbar({
                open: true,
                message: "Login required to add this product to wishlist!",
                severity: "error",
            });
            return;
        }


        const result = await dispatch(addProductToWishlist(values))
        if (addProductToWishlist.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Product added to wishlist successfully.",
                severity: "success",
            });
        } else if (addProductToWishlist.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to add the product to the wishlist. Please try again.",
                severity: "error",
            });
        }

    }

    const handleUpdateQuantity = (value: number) => {
        setQuantity(quantity + value);
    }




    const productDetails = product?.product;
    const brandName = productDetails?.seller?.businessName;
    const title = productDetails?.title;
    const description = productDetails?.description;
    const totalRating = productDetails?.ratings;
    const mrpPrice = productDetails?.mrpPrice;
    const sellingPrice = productDetails?.sellingPrice;
    const discount = productDetails?.discountInPercentage;



    if (product.loading) {
        return (
            <ProductDetailsSkeleton />
        );
    }

    if (product.error) {
        return (
            <Box className="flex flex-col items-center justify-center py-20 mb-20 text-center">
                <ErrorOutlineRounded color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" color="error" gutterBottom>
                    Oops! Something went wrong
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {product.error || "We couldn't load this product right now. Please try again later."}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.reload()}
                    sx={{ textTransform: "none", px: 3, py: 1 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }


    return (
        <>
            <div className="px-5 lg:px-20 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Image Preview */}
                    <section className="flex flex-col lg:flex-row gap-5">
                        {/* Thumbnail images */}
                        <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
                            {product.product?.images?.length ? (
                                product.product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        onClick={() => handleActiveImage(index)}
                                        src={image}
                                        alt={`product image ${index}`}
                                        className={`lg:w-full w-[48%] cursor-pointer rounded-md border 
        ${activeImage === index ? "border-primary-color" : "border-gray-200"} 
        duration-150 hover:brightness-110`}
                                    />
                                ))
                            ) : (
                                <img
                                    src={placeHolderImage}
                                    alt="No product image"
                                    className="lg:w-full w-[48%] cursor-pointer rounded-md border border-gray-200"
                                />
                            )}

                        </div>

                        {/* Main Preview */}
                        <div className="w-full lg:w-[85%]">
                            <img
                                src={productDetails?.images?.[activeImage] ?? placeHolderImage}
                                alt="product"
                                className="w-full rounded-lg shadow-md"
                            />
                        </div>
                    </section>

                    {/* Right: Product Info */}
                    <section>
                        {/* Brand & Title */}
                        <h2 className="text-lg font-semibold text-gray-700">{brandName}</h2>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">{title}</h1>
                        <p className="text-gray-600 mt-2">{description}</p>

                        {/* Ratings */}
                        <div className="flex items-center gap-3 py-3 mt-4 px-4 light-thin-border rounded-md w-fit shadow-sm">
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{productDetails?.productReviews?.length}</span>
                                <StarRateRoundedIcon
                                    sx={{ color: yellow[700], fontSize: "20px" }}
                                />
                            </div>
                            <Divider orientation="vertical" flexItem />
                            <span className="text-sm text-gray-600">
                                {totalRating} Ratings
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-6">
                            <div className="flex items-center gap-3 text-2xl font-semibold">
                                <span className="text-gray-900">Rs. {sellingPrice}</span>
                                <span className="line-through text-gray-400 text-lg">
                                    Rs. {mrpPrice}
                                </span>
                                <span className="text-green-600 text-lg font-bold">
                                    {discount}% Off
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm italic mt-1">
                                Inclusive of all taxes. Free Shipping above Rs. 1500
                            </p>
                        </div>


                        <Chip
                            label={
                                (productDetails?.stocks ?? 0) <= 0
                                    ? "Out of Stock"
                                    : `In Stock (${productDetails?.stocks ?? 1})`
                            }
                            color={(productDetails?.stocks ?? 0) <= 0 ? "warning" : "success"}
                        />



                        {/* Assurance */}
                        <div className="mt-8 space-y-3 text-gray-700">
                            <div className="flex items-center gap-3">
                                <ShieldRounded sx={{ color: green[400] }} />
                                <p>Authentic & Quality Assurance</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <WorkspacePremiumRounded sx={{ color: green[400] }} />
                                <p>100% Money Back Guarantee</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <LocalShippingRounded sx={{ color: green[400] }} />
                                <p>Free Shipping & Returns</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <WalletRounded sx={{ color: green[400] }} />
                                <p>Cash on Delivery Available</p>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex justify-between items-center gap-2 w-[140px]">
                            <h1 className="font-medium text-gray-700 mb-2">Quantity:</h1>

                            <IconButton
                                disabled={quantity == 0}
                                onClick={() => handleUpdateQuantity(-1)}
                            >
                                <RemoveRounded />
                            </IconButton>
                            <span className="text-gray-800 font-bold">{quantity}</span>
                            <IconButton onClick={() => handleUpdateQuantity(1)}>
                                <AddRounded />
                            </IconButton>
                        </div>

                        {/* Actions */}
                        <div className="mt-10 flex gap-5">
                            <Button
                                fullWidth
                                variant="contained"
                                disabled={cart.loading || !productDetails?.id || productDetails.stocks < 0}
                                onClick={() =>
                                    handleAddToCart({ productId: productDetails?.id ?? 0, quantity })
                                }
                                startIcon={<AddShoppingCartRounded />}
                                sx={{ py: "14px", fontSize: "15px", fontWeight: 600 }}
                            >
                                {cart.loading ? <CircularProgress color="inherit" size={24} /> : "Add To Cart"}
                            </Button>
                            <Button
                                fullWidth
                                disabled={wishlist.loading || !productDetails?.id}
                                variant="outlined"
                                onClick={() => handleAddToWishlist({ productId: productDetails?.id ?? 0 })}
                                startIcon={<FavoriteBorderRounded />}
                                sx={{ py: "14px", fontSize: "15px", fontWeight: 600 }}
                            >
                                {wishlist.loading ? <CircularProgress color="inherit" size={24} /> : "Add To Wishlist"}
                            </Button>
                        </div>

                        {/* Extra info */}
                        <p className="mt-6 text-sm text-gray-500 italic leading-relaxed">
                            Extra info, Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aspernatur reprehenderit porro asperiores eligendi.
                        </p>

                        {/* Review Section */}

                        {productDetails?.productReviews && productDetails?.productReviews?.length > 0 ?
                            < div
                                onClick={() => navigate(`/reviews/${productDetails?.id}`)}
                                className="mt-8 cursor-pointer"
                            >
                                <ReviewCard review={productDetails.productReviews[0]} key={1} />
                            </div>
                            :
                            <div className="flex items-center justify-center gap-2 text-gray-500 light-thin-border rounded-lg p-4 bg-gray-50">
                                <RateReviewRounded sx={{ fontSize: 28, color: "gray" }} />
                                <span className="text-base font-medium">
                                    This product currently has no verified reviews
                                </span>
                            </div>
                        }
                    </section>
                </div >

                {/* Similar Products */}
                <div className="mt-20">
                    <h2 className="text-lg font-bold text-gray-800 mb-5">Similar Products</h2>
                    <div className="pt-5">
                        {relatedProduct && relatedProduct.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {relatedProduct.map((product) => (
                                    <SimilarProductCard
                                        key={product.id}
                                        product={product}
                                        onProductClick={(productId) => navigate(`/product-details/${productId}/${product.category?.name}/${product.category?.categoryId}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Box className="flex flex-col items-center justify-center py-10 text-center">
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                    No similar products found
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </div >
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </>
    );
};

export default ProductDetails;