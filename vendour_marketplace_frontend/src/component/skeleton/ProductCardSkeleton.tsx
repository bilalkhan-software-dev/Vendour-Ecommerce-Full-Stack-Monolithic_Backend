import { Box, Skeleton } from "@mui/material";

const ProductCardSkeleton = () => {
    return (
        <Box
            className="rounded-md shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-200"
        >
            <Skeleton
                variant="rectangular"
                height={180}
                animation="wave"
                sx={{ borderRadius: "10px", mb: 1 }}
            />

            <Skeleton
                variant="text"
                width="80%"
                height={24}
                animation="wave"
                sx={{ borderRadius: "4px" }}
            />

            <Skeleton
                variant="text"
                width="60%"
                height={20}
                animation="wave"
                sx={{ borderRadius: "4px", mb: 1 }}
            />

            <Box className="flex items-center justify-between mt-2">
                <Skeleton
                    variant="text"
                    width="30%"
                    height={20}
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                />
                <Skeleton
                    variant="text"
                    width="25%"
                    height={20}
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                />
                <Skeleton
                    variant="text"
                    width="20%"
                    height={20}
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                />
            </Box>
        </Box>
    );
};

export default ProductCardSkeleton;
