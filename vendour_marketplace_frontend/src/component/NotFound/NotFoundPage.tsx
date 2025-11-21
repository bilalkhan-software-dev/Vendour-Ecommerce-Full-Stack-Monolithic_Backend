import { Button } from "@mui/material";

const NotFoundPage = () => (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-6xl font-bold text-primary-color mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
        <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = "/"}
            sx={{ px: 6, py: 1.5, borderRadius: 2 }}
        >
            Go to Homepage
        </Button>
    </div>
);

export default NotFoundPage;
