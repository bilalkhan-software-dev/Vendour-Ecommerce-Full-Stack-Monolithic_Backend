import { Box, TextField } from "@mui/material";
import type { FormikProps } from "formik";
import type { FormValues } from "../../../../types/seller";


interface FormStep3Props {
    formik: FormikProps<FormValues>;
}

const FormStep3 = ({ formik }: FormStep3Props) => {
    return (
        <Box>
            <div className="space-y-9">
                {/* Bank Name */}
                <TextField
                    name="bankDetails.bankName"
                    label="Bank Name"
                    fullWidth
                    value={formik.values.bankDetails.bankName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.bankDetails?.bankName &&
                        Boolean(formik.errors.bankDetails?.bankName)
                    }
                    helperText={
                        formik.touched.bankDetails?.bankName &&
                        formik.errors.bankDetails?.bankName
                    }
                    sx={{ marginBottom: 1 }}
                />

                {/* Account Number */}
                <TextField
                    name="bankDetails.accountNumber"
                    label="Account Number"
                    fullWidth
                    value={formik.values.bankDetails.accountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.bankDetails?.accountNumber &&
                        Boolean(formik.errors.bankDetails?.accountNumber)
                    }
                    helperText={
                        formik.touched.bankDetails?.accountNumber &&
                        formik.errors.bankDetails?.accountNumber
                    }
                    sx={{ marginBottom: 1 }}
                />

                {/* IBAN */}
                <TextField
                    name="bankDetails.iban"
                    label="IBAN"
                    fullWidth
                    value={formik.values.bankDetails.iban}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.bankDetails?.iban &&
                        Boolean(formik.errors.bankDetails?.iban)
                    }
                    helperText={
                        formik.touched.bankDetails?.iban &&
                        formik.errors.bankDetails?.iban
                    }
                    sx={{ marginBottom: 1 }}
                />

                {/* Account Holder Name */}
                <TextField
                    name="bankDetails.accountHolderName"
                    label="Account Holder Name"
                    fullWidth
                    value={formik.values.bankDetails.accountHolderName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.bankDetails?.accountHolderName &&
                        Boolean(formik.errors.bankDetails?.accountHolderName)
                    }
                    helperText={
                        formik.touched.bankDetails?.accountHolderName &&
                        formik.errors.bankDetails?.accountHolderName
                    }
                    sx={{ marginBottom: 1 }}
                />
            </div>
        </Box>
    );
};

export default FormStep3;
