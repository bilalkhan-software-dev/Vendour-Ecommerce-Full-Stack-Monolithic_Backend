import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ReviewCard from "../Review/ReviewCard";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { fetchMyReviews } from "../../../redux/slice/customer/reviewSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { ErrorRounded } from "@mui/icons-material";

const MyReviews = () => {
    const { review } = useAppSelector((store) => store);
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });
    useEffect(() => {

        const fetchMyReview = async () => {
            const result = await dispatch(fetchMyReviews());

            if (fetchMyReviews.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to fetch products review. Please try again.",
                    severity: "error",
                });
            }
        }

        fetchMyReview();


    }, [dispatch]);

    if (review.loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }




    return (
        <>
            <Box className="p-5 lg:px-20 space-y-6">
                <Typography variant="h5" className="font-semibold pb-3 text-gray-800">
                    My Reviews
                </Typography>

                {review?.myReviews?.length > 0 ? (
                    <div className="space-y-4">
                        <Alert severity="info" icon={<ErrorRounded fontSize="inherit" />} className="text-sm">
                            You can edit or delete your review within 30 days of posting it.
                        </Alert>
                        {review?.myReviews.map((review, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <Box className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <Typography variant="h6" className="text-gray-600">
                            You haven’t submitted any reviews yet
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                            Start reviewing products you’ve purchased to share your experience!
                        </Typography>
                    </Box>
                )}

            </Box>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default MyReviews;
