import { Skeleton, Box, Grid } from "@mui/material";

const HomeSkeleton = () => {
    return (
        <div className="space-y-10 md:space-y-14 lg:space-y-20 pb-10 px-4 lg:px-20">
            {/* 🟦 Electronics Categories */}
            <Box>
                <Skeleton animation="wave" variant="text" width="25%" height={40} />
                <Grid container spacing={2} className="mt-4">
                    {[...Array(6)].map((_, i) => (
                        <Grid size={{ xs: 6, md: 2 }} key={i}>
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                height={150}
                                className="rounded-xl"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>


            <Box>
                <div className="text-center flex justify-center mb-4">
                    <Skeleton animation="wave" variant="text" width="30%" height={40} />
                </div>

                {/* Tailwind grid layout mimicking the same structure */}
                <div className="grid grid-cols-12 gap-4">
                    {/* grid0 → large left image */}
                    <div className="col-span-12 md:col-span-3">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={600}
                            className="rounded-xl"
                        />
                    </div>

                    {/* grid1 → small top-left */}
                    <div className="col-span-6 md:col-span-2">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={290}
                            className="rounded-xl"
                        />
                    </div>

                    {/* grid2 → medium top-right */}
                    <div className="col-span-6 md:col-span-4">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={290}
                            className="rounded-xl"
                        />
                    </div>

                    {/* grid3 → large right image */}
                    <div className="col-span-12 md:col-span-3">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={600}
                            className="rounded-xl"
                        />
                    </div>

                    {/* grid4 → bottom-left */}
                    <div className="col-span-6 md:col-span-4">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={290}
                            className="rounded-xl"
                        />
                    </div>

                    {/* grid5 → bottom-right */}
                    <div className="col-span-6 md:col-span-2">
                        <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={290}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </Box>


            {/* Hot Deals */}
            <Box>
                <div className="text-center flex justify-center mb-2">
                    <Skeleton animation="wave" variant="text" width="30%" height={40} />
                </div>

                <Grid container spacing={2}>
                    {[...Array(5)].map((_, i) => (
                        <Grid size={{ xs: 6, md: 2.4 }} key={i}>
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                height={220}
                                className="rounded-xl"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Shop by Category */}
            <Box>
                <div className="text-center flex justify-center mb-2">
                    <Skeleton animation="wave" variant="text" width="30%" height={40} />
                </div>

                <Grid container spacing={2}>
                    {[...Array(6)].map((_, i) => (
                        <Grid size={{ xs: 6, md: 4 }} key={i}>
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                height={180}
                                className="rounded-xl"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* 🟪 Become Seller Section */}
            <Box className="relative w-full overflow-hidden rounded-xl mt-6">
                <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={350}
                    className="rounded-2xl"
                />
            </Box>

            {/* Bottom CTA or Footer Section */}
            <Box>
                <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={50}
                    width="100%"
                    className="rounded-xl"
                />
            </Box>
        </div>
    );
};

export default HomeSkeleton;
