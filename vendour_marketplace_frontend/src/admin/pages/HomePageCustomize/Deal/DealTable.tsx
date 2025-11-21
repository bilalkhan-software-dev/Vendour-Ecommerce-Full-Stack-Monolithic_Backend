import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { deleteDeal, getAllDeals } from '../../../../redux/slice/admin/dealSlice';
import ImageZoomOverlay from '../../../../component/ImageZoomOverLay/ImageZoomOverlay';
import type { SnackbarProps } from '../../../../types/props';
import Swal from 'sweetalert2';
import SnackbarMessage from '../../../../component/SnackbarMessage/SnackbarMessage';


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


export default function DealTable() {


    const dispatch = useAppDispatch();
    const deal = useAppSelector(store => store.deal);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        dispatch(getAllDeals())
    }, [dispatch])

    const handleDeleteDeal = async (dealId: number) => {
        const result = await dispatch(deleteDeal({ dealId: dealId }))
        if (deleteDeal.rejected.match(result)) {
            setSnackbar({
                open: true,
                message: result.payload || "Unable to delete the deal. Please try again.",
                severity: "error",
            });
        }
    }

    const handleDeleteDealWithConfirm = async (dealId: number) => {
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
            await handleDeleteDeal(dealId);
            Swal.fire('Deleted!', 'Deal has been deleted.', 'success');
        }
    };

    if (deal.loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr. No</StyledTableCell>
                            <StyledTableCell>Id</StyledTableCell>
                            <StyledTableCell align="left">Image</StyledTableCell>
                            <StyledTableCell align="left">Home Category Id</StyledTableCell>
                            <StyledTableCell align="left">Home Category Name</StyledTableCell>
                            <StyledTableCell align="left">Discount in %</StyledTableCell>
                            <StyledTableCell align="left">Update</StyledTableCell>
                            <StyledTableCell align="left">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deal?.deals?.map((deal, index) => (
                            <StyledTableRow key={deal.id} className="hover:bg-gray-100 cursor-pointer">
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell> <StyledTableCell component="th" scope="row">
                                    {deal.id}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <ImageZoomOverlay key={deal.id} imageUrl={deal.homeCategory.image} alt={deal.homeCategory.name} />
                                </StyledTableCell>
                                <StyledTableCell align='left'>{deal.homeCategory.categoryId}</StyledTableCell>
                                <StyledTableCell align='left'>{deal.homeCategory.name}</StyledTableCell>
                                <StyledTableCell align='left'>{deal.discount}</StyledTableCell>
                                <StyledTableCell align='left'>
                                    <IconButton>
                                        <Tooltip title="Click to Edit"
                                            slots={{
                                                transition: Zoom,
                                            }}>
                                            <EditRounded className='text-primary-color' />
                                        </Tooltip>
                                    </IconButton>
                                </StyledTableCell>

                                <StyledTableCell align='left'>
                                    <IconButton
                                        onClick={() => handleDeleteDealWithConfirm(deal.id)}
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
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
        </>
    );
}
