import { Box, Typography, Paper, LinearProgress, Button, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { PaymentRounded, CheckCircleOutline, ErrorOutline, CheckCircleRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { paymentVerifySuccessStripe } from "../../../redux/slice/customer/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import type { SnackbarProps } from "../../../types/props";

const CheckoutSuccess = () => {
    const loading = useAppSelector((store) => store.order.loading);
    const [success, setSuccess] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });


    const getQueryParam = (param: string): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    useEffect(() => {
        const checkPaymentStatus = async () => {

            const session_id = getQueryParam('session_id');
            const order_id = getQueryParam('order_id');


            const result = await dispatch(
                paymentVerifySuccessStripe({ session_id: session_id as string, order_id: order_id as string })
            );
            if (paymentVerifySuccessStripe.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload.message || "Payment confirmed!",
                    severity: "success",
                });
                setSuccess(true);
            } else if (paymentVerifySuccessStripe.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message: result.payload || "Payment failed!",
                    severity: "error",
                });
                setSuccess(false);
            }
        };

        checkPaymentStatus();
    }, [dispatch]);

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
                px={2}
            >
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
                    {loading && (
                        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Fade in={loading} timeout={500} unmountOnExit>
                        <Box>
                            <PaymentRounded
                                sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Thanks for your order!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please wait while we confirm your order...
                            </Typography>
                        </Box>
                    </Fade>

                    <Fade in={!loading && success === true} timeout={500} unmountOnExit>
                        <Box>
                            <CheckCircleOutline
                                sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                            />
                            <Typography variant="h5" gutterBottom>
                                Payment Confirmed <CheckCircleRounded sx={{ color: "success.main" }} />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your order has been placed successfully.
                                You will receive a confirmation email shortly.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/")}
                                sx={{ mt: 3, borderRadius: 2, color: "white" }}
                            >
                                Go to Homepage
                            </Button>
                        </Box>
                    </Fade>

                    <Fade in={!loading && success === false} timeout={500} unmountOnExit>
                        <Box>
                            <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Payment Failed
                            </Typography>
                            {/* <CloseRounded sx={{ color: "error.main", fontSize: 40 }} /> */}
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Something went wrong. Please try again or contact support.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ mt: 3, borderRadius: 2 }}
                                onClick={() => navigate("/cart")}
                            >
                                Back to Cart
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

export default CheckoutSuccess;
