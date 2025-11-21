import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import type { SnackbarProps } from '../../../types/props';
import {
    fetchSellersByAccountStatusForAdmin,
    updateSellerAccountStatus,
} from '../../../redux/slice/admin/adminSellerSlice';
import SnackbarMessage from '../../../component/SnackbarMessage/SnackbarMessage';
import { accountStatuses } from '../../../data/admin/data';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${TableCell.head}`]: {
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        fontWeight: 600,
        fontSize: '0.9rem',
        textTransform: 'uppercase',
    },
    [`&.${TableCell.body}`]: {
        fontSize: 14,
        padding: '12px 16px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const StatusTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    textTransform: 'capitalize',
}));

const Sellers = () => {
    const [accountStatus, setAccountStatus] = useState('ACTIVE');
    const loading = useAppSelector((store) => store.adminSeller.loading);
    const sellers = useAppSelector((store) => store.adminSeller.sellers);
    const dispatch = useAppDispatch();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchSellers = async () => {
            const result = await dispatch(
                fetchSellersByAccountStatusForAdmin({ accountStatus })
            );
            if (fetchSellersByAccountStatusForAdmin.rejected.match(result)) {
                setSnackbar({
                    open: true,
                    message:
                        result.payload ||
                        'Unable to fetch sellers. Please try again later.',
                    severity: 'error',
                });
            }
        };
        fetchSellers();
    }, [dispatch, accountStatus]);

    const handleUpdateSellerAccountStatus = async (
        sellerId: number,
        accountStatus: string
    ) => {
        const result = await dispatch(
            updateSellerAccountStatus({ sellerId, accountStatus })
        );

        if (updateSellerAccountStatus.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message: 'Account status updated successfully.',
                severity: 'success',
            });
        } else {
            setSnackbar({
                open: true,
                message:
                    result.payload ||
                    'Unable to update account status. Please try again later.',
                severity: 'error',
            });
        }
    };

    const getStatusBackgroundColor = (status: string) => {
        switch (status) {
            case "PENDING_VERIFICATION":
                return "rgba(255, 193, 7, 0.15)"; // amber
            case "ACTIVE":
                return "rgba(76, 175, 80, 0.15)"; // green
            case "SUSPENDED":
                return "rgba(255, 87, 34, 0.15)"; // deep orange
            case "DEACTIVATED":
                return "rgba(158, 158, 158, 0.15)"; // grey
            case "BANNED":
                return "rgba(244, 67, 54, 0.15)"; // red
            case "CLOSED":
                return "rgba(96, 125, 139, 0.15)"; // blue-grey
            default:
                return "rgba(158, 158, 158, 0.15)";
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "PENDING_VERIFICATION":
                return "#ffb300";
            case "ACTIVE":
                return "#4caf50";
            case "SUSPENDED":
                return "#ff5722";
            case "DEACTIVATED":
                return "#9e9e9e";
            case "BANNED":
                return "#f44336";
            case "CLOSED":
                return "#607d8b";
            default:
                return "#9e9e9e";
        }
    };


    if (loading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Filter Section */}
            <Box pb={4} sx={{ maxWidth: 240 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Account Status</InputLabel>
                    <Select
                        label="Account Status"
                        value={accountStatus}
                        onChange={(e) => setAccountStatus(e.target.value)}
                    >
                        {accountStatuses.map((status) => (
                            <MenuItem key={status.id} value={status.status}>
                                {status.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Table Section */}
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 700 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Seller Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Mobile</StyledTableCell>
                            <StyledTableCell>STRN</StyledTableCell>
                            <StyledTableCell>Business Name</StyledTableCell>
                            <StyledTableCell>Account Status</StyledTableCell>
                            <StyledTableCell>Email Status</StyledTableCell>
                            <StyledTableCell align="center">Change</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {sellers && sellers.length > 0 ? (
                        <TableBody>
                            {sellers.map((seller) => (
                                <StyledTableRow key={seller.id}>
                                    <StyledTableCell>{seller.name}</StyledTableCell>
                                    <StyledTableCell>{seller.email}</StyledTableCell>
                                    <StyledTableCell>{seller.mobile}</StyledTableCell>
                                    <StyledTableCell>{seller.strn ?? "Not Avaiable"}</StyledTableCell>
                                    <StyledTableCell>
                                        {seller?.sellerBusinessDetails?.businessName}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <StatusTypography
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: "12px",
                                                fontWeight: 500,
                                                display: "inline-block",
                                                textTransform: "capitalize",
                                                backgroundColor: getStatusBackgroundColor(seller.accountStatus ?? "ACTIVE"),
                                                color: getStatusTextColor(seller.accountStatus ?? "ACTIVE"),
                                            }}
                                        >
                                            {seller.accountStatus?.replaceAll("_", " ") || "ACTIVE"}
                                        </StatusTypography>

                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {seller.emailVerified ? (

                                            <Typography color="success.main"
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: "12px",
                                                    color: "white",
                                                    bgcolor: "success.light"
                                                }}
                                            >Verified</Typography>
                                        ) : (
                                            <Typography color="text.secondary"
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: "12px",
                                                    color: "white",
                                                    bgcolor: "error.light"
                                                }}
                                            >Not Verified</Typography>
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Select
                                            size="small"
                                            value={seller.accountStatus}
                                            disabled={!seller.id}
                                            onChange={(e) =>
                                                handleUpdateSellerAccountStatus(
                                                    seller?.id ?? 0,
                                                    e.target.value
                                                )
                                            }
                                            sx={{ minWidth: 160, ml: 1 }}
                                        >
                                            {accountStatuses.map((status) => (
                                                <MenuItem key={status.id} value={status.status}>
                                                    {status.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{ py: 3, fontWeight: 500 }}
                                    >
                                        No sellers found for this status.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

            {/* Snackbar */}
            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </>
    );
};

export default Sellers;
