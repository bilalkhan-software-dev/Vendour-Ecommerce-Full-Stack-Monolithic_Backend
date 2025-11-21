import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { sentSigninUpOtp, signup } from "../../../redux/slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import * as Yup from "yup"
import { useFormik } from "formik";
import type { SnackbarProps } from "../../../types/props";
import { useNavigate } from "react-router-dom";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";


const SignupForm = () => {

    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        otp: Yup.string()
            .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
            .required("OTP is required"),
        fullName: Yup.string()
            .matches(/^[^\d][a-zA-Z\s.]{2,}$/, "Full name must not start with a number and must be valid")
            .required("Full name is required"),
        mobile: Yup.string()
            .matches(/^03[0-9]{9}$/, "Mobile number must be a valid Pakistani number (e.g. 03XXXXXXXXX)")
            .required("Mobile number is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: '',
            mobile: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            const result = await dispatch(signup(values))
            if (signup.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Account Successfully Created", // success message
                    severity: "success",
                });
                setTimeout(() => {
                    navigate("/account");
                }, 4000);
            } else if (signup.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Failed to send OTP",
                    severity: "error",
                });
            }
        },
    });

    const handleSendOtp = async () => {
        if (!formik.values.email || formik.errors.email) {
            formik.setTouched({ email: true });
            return;
        }
        const result = await dispatch(sentSigninUpOtp({ email: formik.values.email, role: "ROLE_CUSTOMER" }));
        if (sentSigninUpOtp.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload.message, // success message from API
                severity: "success",
            });
        } else if (sentSigninUpOtp.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Failed to send OTP",
                severity: "error",
            });
        }
    };

    // Refs for each OTP box
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle OTP box input
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;

        if (/^[0-9]?$/.test(value)) {
            const otpArray = formik.values.otp.split("");
            otpArray[index] = value;
            const newOtp = otpArray.join("");
            formik.setFieldValue("otp", newOtp);

            // auto focus next box
            if (value && otpRefs.current[index + 1]) {
                otpRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handle backspace focus
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !formik.values.otp[index] && otpRefs.current[index - 1]) {
            otpRefs.current[index - 1]?.focus();
        }
    };



    return (
        <>
            <Box>
                <p className="text-xl font-bold text-center pb-6 text-primary-color">
                    Create an Account
                </p>
                <form onSubmit={formik.handleSubmit}>
                    <div className="space-y-9">
                        {/* Email */}
                        <TextField
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            label="Enter Email"
                            fullWidth
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        {/* OTP input boxes */}
                        {auth.isOtpSent &&
                            <div className="space-y-2 mt-3">
                                <p className="font-medium text-sm opacity-60">
                                    Enter the OTP sent to your email
                                </p>
                                <Box display="flex" gap={2} justifyContent="center">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TextField
                                            key={index}
                                            inputRef={(el) => (otpRefs.current[index] = el)}
                                            inputProps={{
                                                maxLength: 1,
                                                style: { textAlign: "center", fontSize: "20px" },
                                            }}
                                            sx={{ width: 80 }}
                                            value={formik.values.otp[index] || ""}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    ))}
                                </Box>
                                {formik.touched.otp && formik.errors.otp && (
                                    <p className="text-red-600 text-sm text-center">
                                        {formik.errors.otp}
                                    </p>
                                )}
                                <TextField
                                    name="fullName"
                                    type="fullName"
                                    onChange={formik.handleChange}
                                    value={formik.values.fullName}
                                    label="Enter Full Name"
                                    fullWidth
                                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                    helperText={formik.touched.fullName && formik.errors.fullName}
                                    sx={{ marginTop: 1 }}
                                />
                                <TextField
                                    name="mobile"
                                    type="mobile"
                                    onChange={formik.handleChange}
                                    value={formik.values.mobile}
                                    label="Enter Mobile No"
                                    fullWidth
                                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                    helperText={formik.touched.mobile && formik.errors.mobile}
                                    sx={{ marginTop: 2 }}
                                />
                            </div>
                        }


                    </div>

                    {/* Buttons */}
                    {!auth.isOtpSent &&
                        <Button
                            fullWidth
                            onClick={handleSendOtp}
                            disabled={auth.loading || formik.isSubmitting}
                            variant="contained"
                            sx={{ mt: 2, py: "11px", color: "white" }}
                        >
                            {auth.loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                        </Button>
                    }



                    {auth.isOtpSent && <Button
                        type="submit"
                        fullWidth
                        disabled={auth.loading || formik.isSubmitting}
                        variant="contained"
                        sx={{ mt: 2, py: "11px", color: "white" }}
                    >
                        {auth.loading ? <CircularProgress size={24} color="inherit" /> : "Signup"}

                    </Button>
                    }
                </form>
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

export default SignupForm;