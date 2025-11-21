import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Fade,
    IconButton,
    Modal,
} from "@mui/material";
import type { HomeCategoryResponse } from "../../../types/homeCategory";
import ImageZoomOverlay from "../../../component/ImageZoomOverLay/ImageZoomOverlay";
import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import Swal from 'sweetalert2';
import { useAppDispatch } from "../../../redux/store";
import { deleteHomeCategory } from "../../../redux/slice/admin/adminHomePageCustomizationSlice";
import { fetchAllHomePageData } from "../../../redux/slice/admin/adminHomePageCustomizationSlice";
import UpdateModel from "./UpdateHomePageCategoryModel/UpdateModel";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function HomeCategoryTable({
    data,
}: {
    data: HomeCategoryResponse[];
}) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<HomeCategoryResponse | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "info",
    });
    const dispatch = useAppDispatch();

    const handleOpenModal = (category: HomeCategoryResponse) => {
        setSelectedCategory(category);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedCategory(null);
    };


    const handleDeletHomePageCategory = async (id: number) => {
        const result = await dispatch(deleteHomeCategory({ homeCategoryId: id }))
        if (deleteHomeCategory.fulfilled.match(result)) {
            dispatch(fetchAllHomePageData())
        } else if (deleteHomeCategory.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to delete home category. Please try again later!",
                severity: "error"
            })
        }
    }

    const handleDeleteDealWithConfirm = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            await handleDeletHomePageCategory(id);
            Swal.fire('Deleted!', 'Home category has been deleted.', 'success');
        }
    };




    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>No.</StyledTableCell>
                            <StyledTableCell align="left">Id</StyledTableCell>
                            <StyledTableCell align="left">Image</StyledTableCell>
                            <StyledTableCell align="left">Category</StyledTableCell>
                            <StyledTableCell align="left">Name</StyledTableCell>
                            <StyledTableCell align="left">Edit</StyledTableCell>
                            <StyledTableCell align="left">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((shopByCategory, index) => (
                            <StyledTableRow
                                key={shopByCategory.id}
                                className="hover:bg-gray-100 cursor-pointer"
                            >
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {shopByCategory.id}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    <ImageZoomOverlay
                                        key={index}
                                        imageUrl={shopByCategory.image}
                                        alt={shopByCategory.name}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {shopByCategory.categoryId}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {shopByCategory.name}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    <IconButton
                                        onClick={() => handleOpenModal(shopByCategory)}
                                        color="primary"
                                    >
                                        <EditRounded />
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <IconButton
                                        onClick={() => handleDeleteDealWithConfirm(shopByCategory.id)}
                                    >
                                        <DeleteRounded className='text-red-600' />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <SnackbarMessage
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />

            {/* Update Modal */}
            <Modal
                aria-labelledby="update-category-modal"
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
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
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
                        {selectedCategory && (
                            <UpdateModel
                                category={selectedCategory}
                                onClose={handleCloseModal}
                                setSnackbar={setSnackbar}
                            />
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
