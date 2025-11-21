import { Box, Skeleton } from "@mui/material";

const CartSkeleton = () => {
    return (
        <Box className="pt-10 px-5 sm:px-10 md:px-60 w-full min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left side — Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Box
                            key={i}
                            className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center"
                        >
                            <Skeleton
                                variant="rectangular"
                                width={100}
                                height={100}
                                sx={{ borderRadius: "8px" }}
                            />
                            <Box className="flex-1 space-y-2">
                                <Skeleton variant="text" width="70%" height={20} />
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="text" width="30%" height={20} />
                            </Box>
                        </Box>
                    ))}
                </div>

                {/* Right side — Coupon & Pricing */}
                <div className="space-y-4">
                    <Box className="border border-gray-200 rounded-md p-5 space-y-3">
                        <Skeleton variant="text" width="40%" height={24} />
                        <Box className="flex gap-3">
                            <Skeleton variant="rectangular" width="70%" height={40} />
                            <Skeleton variant="rectangular" width="30%" height={40} />
                        </Box>
                    </Box>

                    <Box className="border border-gray-200 rounded-md p-5 space-y-3">
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="40%" height={24} />
                        <Skeleton variant="rectangular" width="100%" height={45} sx={{ borderRadius: "8px" }} />
                    </Box>

                    <Box className="border border-gray-200 rounded-md p-5">
                        <Skeleton variant="text" width="50%" height={20} />
                    </Box>
                </div>
            </div>
        </Box>
    );
};

export default CartSkeleton;
