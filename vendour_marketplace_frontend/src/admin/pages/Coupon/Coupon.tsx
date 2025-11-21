import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { Backdrop, Box, CircularProgress, Fade, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Modal, Select, Switch, Tooltip, Typography, Zoom } from '@mui/material';
import { DeleteRounded, EditRoad, EditRounded } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import type { SnackbarProps } from '../../../types/props';
import { allCoupons, deleteCoupon, updateCoupon } from '../../../redux/slice/admin/couponSlice';
import SnackbarMessage from '../../../component/SnackbarMessage/SnackbarMessage';
import UpdateCoupon from './UpdateCoupon';
import type { CouponResponse } from '../../../types/coupon';
import dayjs from 'dayjs';


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
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Coupon = () => {

    const [couponStatus, setCouponStatus] = useState("");




    const loading = useAppSelector((store) => store.coupon.loading);
    const coupons = useAppSelector((store) => store.coupon.coupons);
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });
    const [open, setOpen] = useState(false);
    const [selectedCouponForEdit, setSelectedCouponForEdit] = useState<CouponResponse>();


    useEffect(() => {
        const fetchCoupons = async () => {
            const result = await dispatch(allCoupons({ couponStatus }));
            if (allCoupons.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message:
                        result.payload ||
                        "Unable to fetch coupons. Please try again later.",
                    severity: "error",
                });
            }
        };
        fetchCoupons();
    }, [dispatch, couponStatus]);

    // const handleUpdateCouponStatus = async (orderId: number) => {
    //     // const result = await dispatch(updateCoupon({ couponId, request: "" }));

    //     if (updateCoupon.fulfilled.match(result)) {
    //         setSnackbar({
    //             open: true,
    //             message: "Coupon updated successfully.",
    //             severity: "success",
    //         });
    //     } else if (updateCoupon.rejected.match(result)) {
    //         setSnackbar({
    //             open: true,
    //             message:
    //                 result.payload ||
    //                 "Unable to update coupon. Please try again later.",
    //             severity: "error",
    //         });
    //     }
    // };


    const handleDeleteCoupon = async (couponId: number) => {
        const result = await dispatch(deleteCoupon({ couponId }));

        if (deleteCoupon.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: "Coupon deleted successfully.",
                severity: "success",
            });
        } else if (deleteCoupon.rejected.match(result)) {
            setSnackbar({
                open: true,
                message:
                    result.payload ||
                    "Unable to delete coupon. Please try again later.",
                severity: "error",
            });
        }
    };

    const handleChange = (event: any) => {
        setCouponStatus(event.target.value);
    }

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const formatDate = (date: string): string => {
        if (!date) return "";
        return dayjs(date).format("DD MMM YYYY, hh:mm A");
    };

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }



    return (
        <>
            <div className='pb-5 w-60'>
                {/* Drop-down filter */}
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Coupon Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={couponStatus}
                        label="Coupon Status"
                        onChange={handleChange}
                    >

                        <MenuItem value=''>All</MenuItem>
                        <MenuItem value='ACTIVE'>Active</MenuItem>
                        <MenuItem value='INACTIVE'>Inactive</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {/* Table */}

            <div>
                <p className='text-start text-primary-color font-semibold  text-xl'>Total: {coupons?.length}</p>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} stickyHeader aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Coupon Code</StyledTableCell>
                                <StyledTableCell align="left">Start Date</StyledTableCell>
                                <StyledTableCell align="left">End Date</StyledTableCell>
                                <StyledTableCell align="left">Discount in %</StyledTableCell>
                                <StyledTableCell align="left">Minimum Order Value</StyledTableCell>
                                <StyledTableCell align="left">Coupon Status</StyledTableCell>
                                <StyledTableCell align="left">Edit</StyledTableCell>
                                <StyledTableCell align="left">Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        {coupons && coupons.length > 0 ? (
                            <TableBody>
                                {coupons.map((coupon) => (
                                    <StyledTableRow key={coupon.couponId} className="hover:bg-gray-100 cursor-pointer">
                                        <StyledTableCell component="th" scope="row">
                                            {coupon.code}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{formatDate(coupon.startDate)}</StyledTableCell>
                                        <StyledTableCell align="left">{formatDate(coupon.endDate)}</StyledTableCell>
                                        <StyledTableCell align="left">{coupon.discountInPercentage}%</StyledTableCell>
                                        <StyledTableCell align="left">{coupon.minimumOrderValue}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Typography
                                                sx={{
                                                    display: "inline-block",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: "8px",
                                                    fontWeight: 600,
                                                    color: coupon.active ? "#0f5132" : "#842029",          
                                                    backgroundColor: coupon.active ? "#d1e7dd" : "#f8d7da",
                                                    textAlign: "center",
                                                    width: "fit-content",
                                                }}
                                            >
                                                {coupon.active ? "ACTIVE" : "INACTIVE"}
                                            </Typography>
                                        </StyledTableCell>

                                        <StyledTableCell align='left'>
                                            <IconButton
                                                onClick={() => {
                                                    handleOpenModal();
                                                    setSelectedCouponForEdit(coupon);
                                                }}
                                            >
                                                <EditRounded className='text-blue-600' />
                                            </IconButton>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <IconButton
                                                onClick={() => handleDeleteCoupon(coupon.couponId)}
                                            >
                                                <DeleteRounded className='text-red-600' />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={12} align="center">
                                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                            {"No coupons found for this status."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </div>
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            />

            {/* open model for update */}
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
                        <UpdateCoupon onClose={handleCloseModal} coupon={selectedCouponForEdit}
                            setSnackbar={setSnackbar} />
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default Coupon;