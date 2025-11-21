import { Box, TextField } from "@mui/material";
import type { FormValues } from "../../../../types/seller";
import type { FormikProps } from "formik";

interface FormStep4Props {
    formik: FormikProps<FormValues>;
}

const FormStep4 = ({ formik }: FormStep4Props) => {
    return (
        <>
            <Box>
                <div className="space-y-9">

                    <TextField
                        name="businessDetails.businessName"
                        onChange={formik.handleChange}
                        value={formik.values.businessDetails.businessName}
                        label="Business Name"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.touched.businessDetails?.businessName && Boolean(formik.errors.businessDetails?.businessName)}
                        helperText={formik.touched.businessDetails?.businessName && formik.errors.businessDetails?.businessName}
                        sx={{ marginBottom: '10px' }}
                    />
                    <TextField
                        name="businessDetails.businessEmail"
                        onChange={formik.handleChange}
                        value={formik.values.businessDetails.businessEmail}
                        label="Business Email"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.touched.businessDetails?.businessEmail && Boolean(formik.errors.businessDetails?.businessEmail)}
                        helperText={formik.touched.businessDetails?.businessEmail && formik.errors.businessDetails?.businessEmail}
                    />
                    <TextField
                        name="businessDetails.businessMobileNumber"
                        onChange={formik.handleChange}
                        value={formik.values.businessDetails.businessMobileNumber}
                        label="Business Mobile Number"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.touched.businessDetails?.businessMobileNumber && Boolean(formik.errors.businessDetails?.businessMobileNumber)}
                        helperText={formik.touched.businessDetails?.businessMobileNumber && formik.errors.businessDetails?.businessMobileNumber}
                        sx={{ marginTop: '10px' }}
                    />
                    <TextField
                        name="businessDetails.businessAddress"
                        onChange={formik.handleChange}
                        value={formik.values.businessDetails.businessAddress}
                        label="Business Address"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.touched.businessDetails?.businessAddress && Boolean(formik.errors.businessDetails?.businessAddress)}
                        helperText={formik.touched.businessDetails?.businessAddress && formik.errors.businessDetails?.businessAddress}
                        sx={{ marginTop: '10px' }}
                    />

                </div>
            </Box>
        </>
    );
};

export default FormStep4;