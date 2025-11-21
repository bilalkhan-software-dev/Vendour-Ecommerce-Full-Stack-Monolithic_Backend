import { Box, Typography, Paper, Button, CircularProgress, LinearProgress } from "@mui/material";
import { CancelOutlined, ErrorOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { paymentVerifyCancelStripe } from "../../../redux/slice/customer/orderSlice";
import { useNavigate } from "react-router-dom";

const CheckoutCancel = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((store) => store.order.loading);
    const [success, setSuccess] = useState<boolean | null>(null);
    const navigate = useNavigate();

    const getQueryParam = (param: string): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    useEffect(() => {
        const checkPaymentStatus = async () => {

            const session_id = getQueryParam('session_id');
            const order_id = getQueryParam('order_id');

            const result = await dispatch(
                paymentVerifyCancelStripe({ session_id: session_id as string, order_id: order_id as string })
            );

            if (paymentVerifyCancelStripe.fulfilled.match(result)) {
                setSuccess(true);
            } else if (paymentVerifyCancelStripe.rejected.match(result)) {
                setSuccess(false);
            }
        };


        checkPaymentStatus();

    }, [dispatch]);

    return (
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

                }}
            >
                {loading && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                        <LinearProgress />
                    </Box>
                )}

                {loading ? (
                    <>
                        <CircularProgress color="error" sx={{ mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Checking payment status...
                        </Typography>
                    </>
                ) : success ? (
                    <>
                        <CancelOutlined sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Payment Canceled
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            Your payment has been canceled successfully.
                            If this was a mistake, you can try again.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, borderRadius: 2 }}
                            href="/cart"
                        >
                            Try Again
                        </Button>
                    </>
                ) : (
                    <>
                        <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Verification Failed
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            We couldn’t verify your cancellation request. Please refresh or contact support.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 3, borderRadius: 2 }}
                            onClick={() => navigate("/cart")}
                        >
                            Back to Cart
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default CheckoutCancel;
