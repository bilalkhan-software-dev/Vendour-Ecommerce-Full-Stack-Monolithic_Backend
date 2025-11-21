import { AddPhotoAlternateRounded, CloseRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, IconButton, Rating, TextField, Tooltip, tooltipClasses, Zoom, type AlertColor } from "@mui/material";
import { useFormik } from "formik"
import * as Yup from "yup"
import type { AddReviewRequest, ReviewResponse } from "../../../types/review";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { updateReview } from "../../../redux/slice/customer/reviewSlice";
import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import { uploadToCloudinary } from "../../../util/uploadToCloudinary";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";



interface UpdateFormProps {
    onClose: () => void;
    review: ReviewResponse;
    reviewId: number

}


const UpdateReview = ({ onClose, review, reviewId }: UpdateFormProps) => {

    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success"
    });
    const loading = useAppSelector(store => store.review.loading);

    const [uploadImage, setUploadImage] = useState(false);
    const UpdateReviewFormSchema = Yup.object().shape({
        description: Yup.string()
            .required("Description is required")
            .matches(/^(?!\d).*/, "Description should not start with a number"),
        rating: Yup.number()
            .required("Rating is required")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5"),
        productImages: Yup.array().of(Yup.string().url("Invalid image URL")),
    });



    const formik = useFormik<AddReviewRequest>({
        initialValues: {
            description: review?.description || "",
            rating: review?.rating || 0,
            productImages: review.productImages || [],
        },
        validationSchema: UpdateReviewFormSchema,
        onSubmit: async (values) => {
            console.log('values: ', values)
            const result = await dispatch(updateReview({ request: values, reviewId: reviewId }));

            if (updateReview.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Review updated successfully",
                    severity: "success"
                })
                setTimeout(() => {
                    onClose();
                }, 2000);
            }

            else if (updateReview.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to updated review. Please try again later!",
                    severity: "error"
                })
            }
        },
    })
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadImage(true);
        const image = await uploadToCloudinary(file, "image");

        formik.setFieldValue("productImages", [...formik.values.productImages, image]);
        setUploadImage(false);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...formik.values.productImages];
        updatedImages.splice(index, 1);
        formik.setFieldValue("productImages", updatedImages);
    };




    return (
        <>
            <Box sx={{ maxHeight: "auto" }}>
                <p className="text-xl font-bold text-primary-color text-start relative pb-5">Update Review</p>


                {/* Form fill Section */}
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} >
                            <TextField
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                label="Name"
                                fullWidth
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        marginTop: '4px',
                                        marginLeft: '0px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Rating
                                name="rating"
                                value={formik.values.rating}
                                onChange={(_, value) => formik.setFieldValue("rating", value)}
                                precision={1}
                            />
                            {formik.touched.rating && formik.errors.rating && (
                                <p className="text-red-600 text-sm mt-1">{formik.errors.rating}</p>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <input
                                type="file"
                                accept="image/*"
                                id="image-input"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />

                            {/* Upload placeholder */}
                            <label htmlFor="image-input" className="relative inline-block">
                                <span className="w-24 h-24 border border-primary-color rounded-md cursor-pointer flex items-center justify-center">
                                    <AddPhotoAlternateRounded className="text-gray-700" />
                                </span>
                                {uploadImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
                                        <CircularProgress size={24} />
                                    </div>
                                )}
                            </label>
                            {/* Validation error for images */}
                            {formik.touched.productImages && formik.errors.productImages && (
                                <p className="text-red-600/100 text-sm mt-1">{formik.errors.productImages}</p>
                            )}

                            {/* Uploaded images */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formik.values.productImages.map((image, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-md border"
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                top: 2,
                                                right: 2,
                                                backgroundColor: "white",
                                                "&:hover": { backgroundColor: "white" }
                                            }}
                                        >
                                            <CloseRounded sx={{ fontSize: "1rem" }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>


                        {/* Submit Form */}
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit"
                            variant="contained" 
                            disabled={loading || formik.isSubmitting}
                            fullWidth sx={{ py: "14px" }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Update Review"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Form Close Icon */}
                <div className="absolute top-7 right-1 px-7">
                    <Tooltip title="Click to close" arrow
                        slots={{
                            transition: Zoom,
                        }}
                        slotProps={{
                            popper: {
                                sx: {
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginTop: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginBottom: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginLeft: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginRight: '0px',
                                    },
                                },
                            },
                        }}>
                        <IconButton onClick={onClose} sx={{ paddingBottom: "5px" }}>
                            <CloseRounded />
                        </IconButton>
                    </Tooltip>
                </div>
            </Box >
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default UpdateReview;