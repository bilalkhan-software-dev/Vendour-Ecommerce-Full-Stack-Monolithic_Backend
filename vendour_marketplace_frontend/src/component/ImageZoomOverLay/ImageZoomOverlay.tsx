import { Backdrop, Box, Fade, IconButton, Modal } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { useState } from "react";
import {  ZoomOutMapRounded } from "@mui/icons-material";

interface ImageZoomOverlayProps {
    imageUrl: string;
    alt?: string;
}

const ImageZoomOverlay = ({ imageUrl, alt }: ImageZoomOverlayProps) => {
    const [open, setOpen] = useState(false);

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(true);
    };
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(false);
    }

    return (
        <>
            {/* Thumbnail */}
            <div className="relative inline-block">
                <img
                    src={imageUrl}
                    alt={alt || "zoomable"}
                    className="rounded-md max-w-[300px] h-20 mt-2 cursor-pointer"
                    onClick={handleOpen}
                />
                <IconButton
                    size="small"
                    onClick={handleOpen}
                    sx={{
                        position: "absolute",
                        top: 5,
                        right: 4,
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.200" },
                    }}
                >
                    <ZoomOutMapRounded />
                </IconButton>
            </div>

            {/* Zoom Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            outline: "none",
                            maxHeight: "90vh",
                            maxWidth: "90vw",
                            p: 0,
                        }}
                    >
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            }}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                        <img
                            src={imageUrl}
                            alt={alt || "zoomed"}
                            className="max-h-[90vh] max-w-[90vw] rounded-md shadow-lg"
                        />
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ImageZoomOverlay;
