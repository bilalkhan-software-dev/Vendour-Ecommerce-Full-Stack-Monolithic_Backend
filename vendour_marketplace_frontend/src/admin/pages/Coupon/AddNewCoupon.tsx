import { useFormik } from "formik";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, Button, CircularProgress, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { createCoupon } from "../../../redux/slice/admin/couponSlice";
import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import * as Yup from 'yup';


interface AddNewCouponProps {
  code: string;
  discountInPercentage: number;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  minimumOrderValue: number;
  isActive: boolean;
}

 const couponValidationSchema = Yup.object({
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

const AddNewCoupon = () => {




  const dispatch = useAppDispatch();
  const loading = useAppSelector(store => store.coupon.loading);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik<AddNewCouponProps>({
    initialValues: {
      code: '',
      discountInPercentage: 0,
      startDate: null,
      endDate: null,
      minimumOrderValue: 0,
      isActive: true
    },
    validationSchema: couponValidationSchema,
    onSubmit: async (values) => {
      console.log('Form data', values);
      const formattedData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };
      const result = await dispatch(createCoupon({ request: formattedData }))
      if (createCoupon.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message: "Coupon added successfully.",
          severity: "success"
        })
        formik.resetForm();
      } else if (createCoupon.rejected.match(result)) {
        setSnackbar({
          open: true,
          message: result.payload || "Unable to create add coupon. Please try again later",
          severity: "error"
        })
      }
      console.log('Formatted data', formattedData);

    },
  })
  return (
    <>
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
                {loading ? <CircularProgress color="inherit" size={24} /> : "Create Coupon"}
              </Button>
            </Grid>
          </Grid>

        </Box>
      </LocalizationProvider>
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

export default AddNewCoupon;