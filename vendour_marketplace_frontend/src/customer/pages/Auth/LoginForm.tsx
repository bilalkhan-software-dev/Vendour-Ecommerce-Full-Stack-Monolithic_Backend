import { useEffect, useRef, useState } from "react";
import { sentSigninUpOtp, signin } from "../../../redux/slice/authSlice";
import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import * as Yup from "yup"
import type { SnackbarProps } from "../../../types/props";
import { useNavigate } from "react-router-dom";



const LoginForm = () => {

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
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
        },
        validationSchema,
        onSubmit: async (values) => {

            const result = await dispatch(signin(values))
            if (signin.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Successfully Login", // success message
                    severity: "success",
                });
                setTimeout(() => {
                    navigate("/account");
                }, 3000);
            } else if (signin.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Wrong OTP!",
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
        const result = await dispatch(sentSigninUpOtp({ email: `login_${formik.values.email}`, role: "ROLE_CUSTOMER" }));
        if (sentSigninUpOtp.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload.message || "OTP sent successfully!",
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


    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    return (
        <>
            <Box>
                <p className="text-xl font-bold text-center pb-9 text-primary-color">
                    Login
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
                            disabled={auth.isOtpSent}
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
                            </div>
                        }
                    </div>

                    {/* Buttons */}
                    {!auth.isOtpSent &&
                        <Button
                            fullWidth
                            onClick={handleSendOtp}
                            variant="contained"
                            disabled={auth.loading || formik.isSubmitting}
                            sx={{ mt: 2, py: "11px", color: "white" }}
                        >
                            {auth.loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                        </Button>
                    }

                    {auth.isOtpSent && <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={auth.loading || formik.isSubmitting}
                        sx={{ mt: 2, py: "11px", color: "white" }}
                    >
                        {auth.loading || formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
                    </Button>
                    }
                    {auth.isOtpSent && (
                        <div className="mt-4 flex items-center justify-between gap-4">
                            {/* Text */}
                            <p className="text-sm text-black">
                                Didn’t receive the code within <span className="font-medium">2 minutes</span>?
                            </p>

                            {/* Button */}
                            <Button
                                onClick={handleSendOtp}
                                variant="outlined"
                                disabled={auth.loading || formik.isSubmitting}
                                sx={{
                                    py: "6px",
                                    px: "16px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    fontWeight: 500,
                                }}
                            >
                                {auth.loading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    "Resend OTP"
                                )}
                            </Button>
                        </div>
                    )}
                </form>

            </Box >
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ marginTop: '50px' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LoginForm;