import { Box, Skeleton } from "@mui/material";

const ProductDetailsSkeleton = () => {
    return (
        <Box className="px-5 lg:px-20 py-10 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT: IMAGE SECTION */}
                <section className="flex flex-col lg:flex-row gap-5">
                    {/* Thumbnail list */}
                    <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                animation="wave"
                                height={90}
                                sx={{
                                    borderRadius: "8px",
                                    width: { xs: "48%", lg: "100%" },
                                }}
                            />
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="w-full lg:w-[85%]">
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            height={400}
                            sx={{ borderRadius: "10px" }}
                        />
                    </div>
                </section>

                {/* RIGHT: DETAILS SECTION */}
                <section className="space-y-4">
                    {/* Brand + Title */}
                    <Skeleton variant="text" animation="wave" width="30%" height={28} />
                    <Skeleton variant="text" animation="wave" width="80%" height={36} />
                    <Skeleton variant="text" animation="wave" width="95%" height={24} />

                    {/* Ratings */}
                    <Box className="flex items-center gap-2 mt-5">
                        <Skeleton variant="rounded" animation="wave" width={120} height={36} />
                    </Box>

                    {/* Price */}
                    <Box className="flex items-center gap-3 mt-5">
                        <Skeleton variant="text" animation="wave" width="30%" height={28} />
                        <Skeleton variant="text" animation="wave" width="20%" height={24} />
                        <Skeleton variant="text" animation="wave" width="15%" height={24} />
                    </Box>

                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="text" animation="wave" width="60%" height={24} />
                    ))}

                    {/* Quantity */}
                    <Box className="flex items-center gap-3 mt-6">
                        <Skeleton variant="rounded" animation="wave" width={140} height={36} />
                    </Box>

                    {/* Buttons */}
                    <Box className="flex gap-5 mt-8">
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="50%"
                            height={48}
                            sx={{ borderRadius: "8px" }}
                        />
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="50%"
                            height={48}
                            sx={{ borderRadius: "8px" }}
                        />
                    </Box>

                    {/* Extra info */}
                    <Skeleton variant="text" animation="wave" width="100%" height={20} />
                    <Skeleton variant="text" animation="wave" width="90%" height={20} />
                </section>
            </div>

            {/* Similar Products section */}
            <div className="mt-20">
                <Skeleton variant="text" animation="wave" width="30%" height={28} />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rectangular"
                            animation="wave"
                            height={200}
                            sx={{ borderRadius: "8px" }}
                        />
                    ))}
                </div>
            </div>
        </Box>
    );
};

export default ProductDetailsSkeleton;
