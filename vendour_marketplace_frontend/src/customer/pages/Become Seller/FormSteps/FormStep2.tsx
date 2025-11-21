import { Box, Grid, TextField } from "@mui/material";

const FormStep2 = ({ formik }: any) => {
    return (
        <>
            <Box sx={{ maxHeight: "auto" }}>

                {/* Form fill Section */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} >
                        <TextField
                            name="pickupAddress.name"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.name}
                            label="Name"
                            fullWidth
                            onBlur={formik.handleBlur}
                            error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
                            helperText={formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name}
                            sx={{
                                '& .MuiFormHelperText-root': {
                                    marginTop: '0px',
                                    marginLeft: '0px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }} >
                        <TextField
                            name="pickupAddress.mobile"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.mobile}
                            label="Contact No."
                            fullWidth
                            error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile}
                            sx={{
                                '& .MuiFormHelperText-root': {
                                    marginTop: '4px',
                                    marginLeft: '0px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }} >
                        <TextField
                            name="pickupAddress.pinCode"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.pinCode}
                            label="Pin Code"
                            fullWidth
                            onBlur={formik.handleBlur}

                            error={formik.touched.pickupAddress?.pinCode && Boolean(formik.errors.pickupAddress?.pinCode)}
                            helperText={formik.touched.pickupAddress?.pinCode && formik.errors.pickupAddress?.pinCode}
                            sx={{
                                '& .MuiFormHelperText-root': {
                                    marginTop: '4px',
                                    marginLeft: '0px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }} >
                        <TextField
                            name="pickupAddress.address"
                            onChange={formik.handleChange}
                            fullWidth
                            value={formik.values.pickupAddress.address}
                            onBlur={formik.handleBlur}
                            label="Current Address"
                            error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
                            helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }} >
                        <TextField
                            name="pickupAddress.city"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.city}
                            label="City"
                            onBlur={formik.handleBlur}

                            error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
                            helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }} >

                        <TextField
                            name="pickupAddress.state"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.state}
                            onBlur={formik.handleBlur}

                            label="State"
                            fullWidth
                            error={formik.touched.pickupAddress?.state && Boolean(formik.errors.pickupAddress?.state)}
                            helperText={formik.touched.pickupAddress?.state && formik.errors.pickupAddress?.state}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            name="pickupAddress.locality"
                            onChange={formik.handleChange}
                            value={formik.values.pickupAddress.locality}
                            onBlur={formik.handleBlur}
                            label="Locality"
                            fullWidth
                            error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
                            helperText={formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default FormStep2;