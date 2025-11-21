import { useFormik } from "formik";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, Button, CircularProgress, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip, tooltipClasses, Zoom } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { updateCoupon } from "../../../redux/slice/admin/couponSlice";
import type { SnackbarProps } from "../../../types/props";
import type { CouponResponse } from "../../../types/coupon";
import * as Yup from 'yup';
import { CloseRounded } from "@mui/icons-material";


interface UpdateCoupon {
    code: string;
    discountInPercentage: number;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    minimumOrderValue: number;
    isActive: boolean;
}

interface UpdateCouponProps {
    onClose: () => void;
    coupon: CouponResponse;
    setSnackbar: React.Dispatch<React.SetStateAction<SnackbarProps>>;
}

const updateCouponValidationSchema = Yup.object({
    code: Yup.string()
        .trim()
        .required('Coupon code is required')
        .min(3, 'Code must be at least 3 characters')
        .max(6, 'Code cannot exceed 6 characters'),

    discountInPercentage: Yup.number()
        .typeError('Discount must be a number')
        .required('Discount is required')
        .min(1, 'Discount must be at least 1%')
        .max(100, 'Discount cannot exceed 100%'),

    startDate: Yup.date()
        .nullable()
        .required('Start date is required'),

    endDate: Yup.date()
        .nullable()
        .required('End date is required')
        .min(
            Yup.ref('startDate'),
            'End date cannot be before start date'
        ),


    minimumOrderValue: Yup.number()
        .typeError('Minimum order value must be a number')
        .required('Minimum order value is required')
        .min(0, 'Minimum order value cannot be negative'),

    isActive: Yup.boolean()
        .required('Coupon status is required'),
});


const UpdateCoupon = ({ coupon, onClose, setSnackbar }: UpdateCouponProps) => {

    const dispatch = useAppDispatch();
    const loading = useAppSelector(store => store.coupon.loading);

    const formik = useFormik<UpdateCoupon>({
        initialValues: {
            code: coupon.code || '',
            discountInPercentage: coupon.discountInPercentage || 0,
            startDate: coupon.startDate ? dayjs(coupon.startDate) : null,
            endDate: coupon.endDate ? dayjs(coupon.endDate) : null,
            minimumOrderValue: coupon.minimumOrderValue || 0,
            isActive: coupon.active ?? true
        },
        validationSchema: updateCouponValidationSchema,
        onSubmit: async (values) => {
            const formattedData = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            };
            const result = await dispatch(updateCoupon({ couponId: coupon.couponId, request: formattedData }));

            if (updateCoupon.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Coupon updated successfully.",
                    severity: "success"
                });

                formik.resetForm();
                onClose();
            } else {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to update coupon. Please try again later",
                    severity: "error"
                });
            }
        },
    });

    return (
        <>
            <p className="text-xl font-bold text-primary-color text-start relative pb-5">Edit Coupon</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    component={"form"}
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* Code and discount */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Coupon Code"
                                name="code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                variant="outlined"
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Discount Percentage"
                                name="discountInPercentage"
                                type="number"
                                value={formik.values.discountInPercentage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                variant="outlined"
                                error={formik.touched.discountInPercentage && Boolean(formik.errors.discountInPercentage)}
                                helperText={formik.touched.discountInPercentage && formik.errors.discountInPercentage}
                            />
                        </Grid>

                        {/* Validity Period */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DateTimePicker
                                label="Start Date"
                                value={formik.values.startDate}
                                onChange={value => formik.setFieldValue('startDate', value)}
                                name="startDate"
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DateTimePicker
                                label="End Date"
                                value={formik.values.endDate}
                                onChange={value => formik.setFieldValue('endDate', value)}
                                sx={{ width: '100%' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Minimum Order Value"
                                name="minimumOrderValue"
                                type="number"
                                value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                variant="outlined"
                                error={formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)}
                                helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formik.values.isActive}
                                        onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
                                        color="success"
                                    />
                                }
                                label={formik.values.isActive ? "Active" : "Inactive"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || formik.isSubmitting}
                                fullWidth
                                sx={{ py: "12px", fontWeight: 'bold', fontSize: '16px' }}
                                className="rounded-lg light-thin-border"
                            >
                                {loading ? <CircularProgress color="inherit" size={24} /> : "Update Coupon"}
                            </Button>
                        </Grid>
                    </Grid>

                </Box>
            </LocalizationProvider>
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
        </>
    );
};

export default UpdateCoupon;