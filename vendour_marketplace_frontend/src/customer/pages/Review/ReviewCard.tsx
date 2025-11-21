import { DeleteRounded, EditRounded, ErrorRounded, MoreVertRounded, Star, ZoomInRounded } from "@mui/icons-material";
import { Alert, Avatar, Backdrop, Box, Fade, Grid, IconButton, Menu, MenuItem, Modal, Rating, Tooltip, Zoom } from "@mui/material";
import type { ReviewResponse } from "../../../types/review";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import type { SnackbarProps } from "../../../types/props";
import { useState } from "react";
import { deleteReview } from "../../../redux/slice/customer/reviewSlice";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import UpdateReview from "./UpdateReview";
import ImageZoomOverlay from "../../../component/ImageZoomOverLay/ImageZoomOverlay";

interface ReviewCardProps {
    review: any
}


const colors = ["#1abc9c", "#3498db", "#9b59b6", "#e67e22", "#e74c3c"];

function getRandomColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}




const ReviewCard = ({ review }: ReviewCardProps) => {
    console.log('review', review);


    dayjs.extend(relativeTime);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const [open, setOpen] = useState(false);


    const handleReviewDelete = ({ reviewId }: { reviewId: number }) => {
        const result = dispatch(deleteReview({ reviewId }));
        if (deleteReview.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Review deleted successfully.",
                severity: "success",
            });
        } else if (deleteReview.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to delete the review. Please try again.",
                severity: "error",
            });
        }
    }


    console.log('review: ', review);



    // For open update modal
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    // Menu for update and delete
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };





    return (
        <>
            <div className="p-4 rounded-lg shadow-sm hover:shadow-md transition relative border border-gray-200/100">
                <Grid container spacing={2} alignItems="flex-start">
                    {/* Avatar */}
                    <Grid size={{ xs: 2 }}>
                        <Box
                            sx={{
                                overflow: "hidden"
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: getRandomColor(review?.user?.fullName || "User"),
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    boxShadow: 2,
                                }}
                            >
                                {review?.user?.fullName
                                    ?.split(" ")
                                    .map((n) => n[0]?.toUpperCase())
                                    .join("")}
                            </Avatar>
                            <span style={{ fontSize: "0.75rem", color: "#4caf50", marginTop: 4 }}>
                                Verified Response
                            </span>
                        </Box>
                    </Grid>

                    {/* Content */}
                    <Grid size={{ xs: 9 }}>
                        <div className="space-y-2">
                            {/* Name + Date */}
                            <div>
                                <p className="font-semibold text-lg">{review?.user?.fullName}</p>
                                <p className="opacity-70 text-sm">
                                    {review?.reviewDate
                                        ? `${dayjs(review.reviewDate).format("MMMM D, YYYY")} • ${dayjs(
                                            review.reviewDate
                                        ).fromNow()}`
                                        : "No date available"}
                                </p>
                            </div>

                            {/* Rating */}
                            <Rating
                                readOnly
                                value={review?.rating}
                                precision={0.5}
                                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />

                            {/* Review Text */}
                            <p className="text-sm md:text-md font-semibold text-gray-800">{review?.description}</p>
                            <div>
                                {review?.productImages && review?.productImages.length > 0 && review?.productImages?.map((image, index) => (
                                    <ImageZoomOverlay key={index} imageUrl={image} alt={review.product?.title} />
                                ))}
                            </div>

                        </div>
                    </Grid>
                    <Grid size={{ xs: 1 }} className="flex justify-end">
                        {auth?.user && auth?.user?.id === review?.user?.id &&
                            <>
                                {/* 3-dot menu button */}
                                <Tooltip title="More actions" arrow
                                    slots={{ transition: Zoom }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={handleMenuOpen}
                                        sx={{ "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}
                                    >
                                        <MoreVertRounded />
                                    </IconButton>
                                </Tooltip>
                                {/* Dropdown menu */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                >
                                    {/* Edit */}
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            handleOpenModal();
                                        }}
                                    >
                                        <EditRounded fontSize="small" style={{ marginRight: 8, color: "blue" }} />
                                        Edit review
                                    </MenuItem>

                                    {/* Delete */}
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            handleReviewDelete({ reviewId: review?.id });
                                        }}
                                    >
                                        <DeleteRounded fontSize="small" style={{ marginRight: 8, color: "red" }} />
                                        Delete review
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                    </Grid>
                </Grid >
                <SnackbarMessage
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                />
            </div >
            {/* Update review modal */}
            <Modal
                aria-labelledby="add-address-modal"
                aria-describedby="form-to-add-new-address"
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: "5%", sm: "50%" },
                            left: "50%",
                            transform: { xs: "translateX(-50%)", sm: "translate(-50%, -50%)" },
                            width: { xs: "90%", sm: 500 },
                            bgcolor: "background.paper",
                            borderRadius: "8px",
                            boxShadow: 24,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            p: 4,
                        }}
                        className="hide-scrollbar"
                    >

                        {review?.product?.id &&
                            <UpdateReview onClose={handleCloseModal} review={review} reviewId={review.id} />
                        }

                        {!review?.product?.id &&
                            <Alert icon={<ErrorRounded fontSize="inherit" />} severity="error">
                                Something went wrong with review ID, that’s why the update review modal is not showing.
                                Refresh the page or try again later.
                            </Alert>
                        }
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ReviewCard;


/** Formatting the review date explanation
 * review?.reviewDate → checks if reviewDate exists (prevents errors).
 * dayjs(review.reviewDate).format("MMMM D, YYYY") → formats the date nicely (e.g., September 23, 2025).
 * dayjs(review.reviewDate).fromNow() → shows relative time (e.g., 2 days ago).
 * Together → "September 23, 2025 • 2 days ago".
 * If no date → "No date available".
 * Example: 
 *    2025-09-20 → September 20, 2025 • 3 days ago.
 */


/** Formatting review name for avatar explanation
 * review?.user?.fullName → get full name if available.
 * .split(" ") → splits the name into parts by spaces.
 * "Bilal Khan" → ["Bilal", "Khan"].
 * .map((n) => n[0]?.toUpperCase()) → takes the first character of each part, makes it uppercase.
 * ["Bilal", "Khan"] → ["B", "K"].
 * .join("") → joins them together.
 * ["B", "K"] → "BK".
 * Example:
 *   "Bilal Khan" → BK.
 *   "Muhammad Bilal Khan" → MBK.
 *   "Bilal" → B.
 */

/** Avatar background color formatter explanation
 * Purpose: Pick a consistent color for a given name (so it doesn’t change on every refresh).
 * let hash = 0; → starting value.
 * Loop over each character in the name:
 * name.charCodeAt(i) → converts character to its ASCII code.
 * hash = name.charCodeAt(i) + ((hash << 5) - hash) → mixes the values to get a unique “hash” number.
 * Math.abs(hash) % colors.length → picks an index within your colors array.
 * Returns one color from your palette.
 */