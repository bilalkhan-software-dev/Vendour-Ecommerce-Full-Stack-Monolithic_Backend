import { Box, Skeleton } from "@mui/material";

const WishlistSkeleton = () => {
    return (
        <>
            <Box className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                    <Box key={index}>
                        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="60%" />
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default WishlistSkeleton;