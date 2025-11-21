import { Box, Typography, Paper, LinearProgress, Button, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckCircleOutline, ErrorOutline, MailOutlineRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import type { SnackbarProps } from "../../../../types/props";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import SnackbarMessage from "../../../../component/SnackbarMessage/SnackbarMessage";
import { verifyEmail, resendVerificationEmail } from "../../../../redux/slice/seller/sellerAuthSlice";

const VerifySeller = () => {
    const sellerAuth = useAppSelector((store) => store.sellerAuth);
    const [success, setSuccess] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email, otp } = useParams();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifySellerEmail = async () => {
            setVerifying(true);
            const result = await dispatch(verifyEmail({ email: email as string, otp: otp as string }));

            if (verifyEmail.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Email verified successfully!",
                    severity: "success",
                });
                setSuccess(true);
            } else {
                setSnackbar({
                    open: true,
                    message: result.payload || "Verification failed.",
                    severity: "error",
                });
                setSuccess(false);
            }
            setVerifying(false);
        };

        verifySellerEmail();
    }, [dispatch, email, otp]);

    const handleResendVerifyEmail = async () => {
        if (!email) return;
        const result = await dispatch(resendVerificationEmail({ email: email }));
        if (resendVerificationEmail.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Verification email resent successfully!",
                severity: "success",
            });
        } else {
            setSnackbar({
                open: true,
                message: result.payload || "Failed to resend email.",
                severity: "error",
            });
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: "0px 0px 8px 8px",
                        textAlign: "center",
                        maxWidth: 400,
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Loading / Verifying */}
                    <Fade in={verifying} timeout={500} unmountOnExit>
                        <Box>
                            <LinearProgress sx={{ mb: 2 }} />
                            <MailOutlineRounded sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Verifying Your Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please wait while we verify your email address...
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Success */}
                    <Fade in={!verifying && success === true} timeout={500} unmountOnExit>
                        <Box>
                            <CheckCircleOutline sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Account Verified!
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your seller account has been verified successfully. You can now log in and start selling.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/become-seller")}
                                sx={{ mt: 3, borderRadius: 2, color: "white" }}
                            >
                                Go to Login
                            </Button>
                        </Box>
                    </Fade>

                    {/* Failure */}
                    <Fade in={!verifying && success === false} timeout={500} unmountOnExit>
                        <Box>
                            <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Verification Failed
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                We could not verify your account. Please check the verification link or contact support.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={sellerAuth.emailVerified}
                                sx={{ mt: 3, borderRadius: 2 }}
                                onClick={handleResendVerifyEmail}
                            >
                                Resend Verification Email
                            </Button>
                        </Box>
                    </Fade>
                </Paper>
            </Box>

            <SnackbarMessage
                message={snackbar.message}
                severity={snackbar.severity}
                open={snackbar.open}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </>
    );
};

export default VerifySeller;
