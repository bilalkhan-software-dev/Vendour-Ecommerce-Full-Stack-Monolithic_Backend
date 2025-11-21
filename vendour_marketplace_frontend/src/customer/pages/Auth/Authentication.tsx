import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Box, Button, Paper, Typography } from "@mui/material";
import authImage from "../../../assets/pics/vendourBanner.png";
import { useAppSelector } from "../../../redux/store";
import { LoginRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { UserResponse } from "../../../types/user";

const Authentication = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const navigate = useNavigate();
    const user = useAppSelector(store => store.auth.user) as UserResponse | null;

    if (user) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "grey.50",
                    px: 2,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        maxWidth: 400,
                        textAlign: "center",
                        borderRadius: 3,
                    }}
                >
                    <LoginRounded
                        sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="h5" fontWeight="600" gutterBottom>
                        Welcome back, {user.fullName}!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        You are already logged in. Continue exploring your account.
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("/account")}
                        color="primary"
                    >
                        Go to Dashboard
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="flex flex-col bg-white shadow-xl/30 rounded-lg overflow-hidden w-full max-w-xl">

                {/* Top Image Section */}
                <div className="w-full border-t rounded-lg h-56 sm:h-72 md:h-80 lg:h-56">
                    <img
                        src={authImage}
                        alt="Authentication"
                        className="object-cover h-full w-full"
                    />
                </div>

                {/* Bottom Form Section */}
                <div className="w-full flex flex-col justify-center px-6 py-8">
                    {isLogin ? <LoginForm /> : <SignupForm />}

                    <div className="text-center mt-6">
                        <p className="text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <Button
                                onClick={() => setIsLogin(!isLogin)}
                                sx={{ textTransform: "none", marginLeft: "0.5rem", fontSize: '16px' }}
                                className="font-medium italic"
                            >
                                {isLogin ? "Create Account" : "Login"}
                            </Button>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Authentication;
