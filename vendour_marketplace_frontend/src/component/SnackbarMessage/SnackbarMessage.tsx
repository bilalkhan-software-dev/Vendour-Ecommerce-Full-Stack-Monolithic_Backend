import { Alert, Snackbar } from "@mui/material";
import type { SnackbarProps } from "../../types/props";

const SnackbarMessage = ({
    open,
    message,
    severity,
    onClose,
    anchorOrigin = { vertical: "top", horizontal: "center" }
}: SnackbarProps) => {
    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        event?.stopPropagation();
        if (reason === "clickaway") return;
        onClose?.(); // parent updates state
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={anchorOrigin}
            sx={{ marginTop: "50px" }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarMessage;