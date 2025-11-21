import ReviewCard from "./ReviewCard";
import { Box, CircularProgress, Rating, Pagination } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductReviews } from "../../../redux/slice/customer/reviewSlice";
import { placeHolderImage } from "../../../data/account/customerAccount";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';

const getBarColor = (stars: number) => {
    if (stars === 5) return 'bg-green-500';
    if (stars >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
};

const calculateReviewBasedOnStars = (stars: number) => {
    if (stars === 5) return "Excellent";
    if (stars === 4) return "Very Good";
    if (stars === 3) return "Good";
    if (stars === 2) return "Average";
    return "Poor";
};

const Review = () => {
    const { review } = useAppSelector(store => store);

    const dispatch = useAppDispatch();
    const { productId } = useParams();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    // Local pagination state
    const [page, setPage] = useState(1);
    const reviewsPerPage = 5;

    useEffect(() => {

        const fetchProductReview = async () => {
            const result = await dispatch(fetchProductReviews({ productId: Number(productId) }));

            if (fetchProductReviews.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to fetch products review. Please try again.",
                    severity: "error",
                });
            }
        }
        fetchProductReview();

    }, [dispatch, productId]);

    if (review.loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }

    // const productReviews = dummyReview;
    const productReviews = review.productReviews;

    const totalReviews = productReviews.length;

    // Calculate average
    const sumOfRatings = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalReviews ? (sumOfRatings / totalReviews).toFixed(1) : '0.0';

    const product = productReviews[0]?.product;

    // Build dynamic breakdown (count reviews by star)
    const ratingData = [5, 4, 3, 2, 1].map(star => ({
        stars: star,
        count: productReviews.filter(r => r.rating === star).length
    }));

    // Pagination slice
    const startIndex = (page - 1) * reviewsPerPage;
    const currentReviews = productReviews.slice(startIndex, startIndex + reviewsPerPage);

    return (
        <>
            <div className="p-5 lg:px-20 flex flex-col lg:flex-row gap-20">
                {/* Product Info */}
                <section className="w-full md:w-1/2 lg:w-[40%] space-y-2">
                    {product?.images ?
                        <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-[50%] object-center rounded-lg md:hover:scale-105 md:duration-150"
                        />
                        :
                        <img
                            src={placeHolderImage}
                            alt=""
                            className="w-full h-[80%] object-center rounded-lg md:hover:scale-105 md:duration-150"
                        />
                    }
                    <div>
                        <p className="font-bold text-xl">{product?.title ?? "Unknown Title"}</p>
                        <p className="text-lg text-gray-600">{product?.description ?? "Unknown Description"}</p>
                    </div>
                    <div className="price flex items-center gap-3 mt-5 text-md">
                        <span className="font-sans text-gray-800">{product?.sellingPrice ?? "00"}</span>
                        <span className="line-through text-gray-400">{product?.mrpPrice ?? "02"}</span>
                        <span className="text-primary-color font-semibold">{product?.discountInPercentage ?? "100%"} Off</span>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="space-y-5 w-full">
                    {/* Summary */}
                    <div className="rating-and-reviews px-6 py-6 border border-gray-200 rounded-md shadow-sm w-full">
                        <div className="mb-6 text-center">
                            <h1 className="text-xl font-semibold mb-1">Ratings & Reviews</h1>
                            <div className="flex items-center justify-center gap-2">
                                <Rating
                                    readOnly
                                    value={parseFloat(averageRating)}
                                    precision={0.5}
                                    size="medium"
                                    emptyIcon={<Star style={{ opacity: 0.4 }} fontSize="inherit" />}
                                />
                                <span className="text-gray-700 text-sm">
                                    ({averageRating} out of 5)
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {totalReviews} user{totalReviews !== 1 ? 's' : ''} reviewed
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3">
                            {ratingData.map(({ stars, count }) => {
                                const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-3">
                                        <h1 className="text-sm font-semibold w-[20%]">
                                            {calculateReviewBasedOnStars(stars)}
                                        </h1>
                                        <div className="w-full h-2 bg-gray-200 hover:bg-gray-300/100 rounded overflow-hidden">
                                            <div
                                                className={`h-full ${getBarColor(stars)}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-6 text-sm text-gray-600">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Customer Reviews */}
                    <div className="space-y-5">
                        <h1 className="text-xl font-semibold">Customer Reviews</h1>
                        {currentReviews.length > 0 ? (
                            <>
                                {currentReviews.map((r, index) => (
                                    <div key={index} className="space-y-3 overflow-hidden">
                                        <ReviewCard review={r} />
                                    </div>
                                ))}

                                {/* Pagination */}
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        count={Math.ceil(totalReviews / reviewsPerPage)}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 p-8 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200/100">
                                <RateReviewRoundedIcon sx={{ fontSize: "4rem", color: "gray" }} />
                                <p className="text-gray-600 font-medium">This product has no review yet!</p>
                            </div>

                        )}
                    </div>
                </section>
            </div>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default Review;
