import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { createDeal } from "../../../../redux/slice/admin/dealSlice";
import type { DealRequest } from "../../../../types/deal";
import { useState } from "react";
import type { SnackbarProps } from "../../../../types/props";
import SnackbarMessage from "../../../../component/SnackbarMessage/SnackbarMessage";
import * as Yup from "yup";

const CreateDeal = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((store) => store.deal.loading);
    const dealCategories = useAppSelector((store) => store.adminHomeCustomization.homePageCategories?.dealCategories);

    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const formik = useFormik<DealRequest>({
        initialValues: {
            discount: 0,
            homeCategory: { id: "" },
        },
        validationSchema: Yup.object({
            discount: Yup.number()
                .min(1, "Discount must be greater than 0")
                .required("Discount is required"),
            homeCategory: Yup.object({
                id: Yup.string().required("Please select a category"),
            }),
        }),
        onSubmit: async (values, { resetForm }) => {
            const result = await dispatch(createDeal({ dealRequest: values }));
            if (createDeal.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Deal created successfully.",
                    severity: "success",
                });
                resetForm();
            } else if (createDeal.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message:
                        result.payload || "Unable to create deal. Please try again later!",
                    severity: "error",
                });
            }
        },
    });

    return (
        <>
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                className="space-y-4 max-w-md mx-auto mt-5 flex flex-col justify-center items-center"
            >
                <Typography
                    variant="h5"
                    className="font-bold italic pb-6"
                    color="primary"
                    gutterBottom
                >
                    Create a New Deal
                </Typography>

                {/* Discount Field */}
                <TextField
                    fullWidth
                    id="discount"
                    name="discount"
                    label="Discount (%)"
                    type="number"
                    required
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.discount && Boolean(formik.errors.discount)}
                    helperText={formik.touched.discount && formik.errors.discount}
                    sx={{ mb: 2 }}
                />

                {/* Category Selection */}
                <FormControl
                    fullWidth
                    required
                    error={
                        formik.touched.homeCategory?.id &&
                        Boolean(formik.errors.homeCategory?.id)
                    }
                    sx={{ mb: 2 }}
                >
                    <InputLabel id="homeCategory-select-label">Category</InputLabel>
                    <Select
                        labelId="homeCategory-select-label"
                        id="homeCategory-select"
                        name="homeCategory.id"
                        value={formik.values.homeCategory.id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Category"
                    >
                        {dealCategories?.map((deal) =>
                            <MenuItem value={deal.id}>{deal.name}</MenuItem>
                        )}

                    </Select>
                    {formik.touched.homeCategory?.id &&
                        formik.errors.homeCategory?.id && (
                            <FormHelperText>
                                {formik.errors.homeCategory.id}
                            </FormHelperText>
                        )}
                </FormControl>

                {/* Submit Button */}
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{ py: "14px" }}
                    type="submit"
                    disabled={loading || formik.isSubmitting}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} /> Creating...
                        </>
                    ) : (
                        "Create Deal"
                    )}
                </Button>
            </Box>

            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </>
    );
};

export default CreateDeal;
