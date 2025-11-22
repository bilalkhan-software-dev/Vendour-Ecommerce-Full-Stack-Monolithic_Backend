import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EditRounded, ErrorRounded } from '@mui/icons-material';
import { Alert, Backdrop, Box, Button, CircularProgress, Fade, IconButton, Modal, Tooltip, Zoom, TablePagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchSellerProducts } from '../../../redux/slice/seller/sellerProductSlice';
import UpdateProductModel from './UpdateProductModel';
import type { ProductResponse } from '../../../types/product';

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


const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className="relative">
            {!isLoaded && (
                <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
                    <CircularProgress size={20} />
                </div>
            )}
            {isInView && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default function ProductTable() {
    const dispatch = useAppDispatch();
    const { sellerProduct } = useAppSelector(store => store);
    const [selectProductForUpdate, setSelectProductForUpdate] = useState<ProductResponse | null>(null);
    const [open, setOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // For open update modal
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    // Pagination handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sellerProducts = sellerProduct?.products || [];

    // Get current page data
    const paginatedProducts = sellerProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Calculate total pages for server-side pagination (if needed)
    const totalProducts = sellerProducts.length;

    // Fetch products on component mount
    useEffect(() => {
        const fetchProduct = async () => {
            await dispatch(fetchSellerProducts());
        }
        fetchProduct();
    }, [dispatch]);

    // For infinite scroll (alternative approach)
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Optional: Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (!tableContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        if (isNearBottom && !sellerProduct.loading && paginatedProducts.length < totalProducts) {
            // Load more products - you might need to modify your API to support pagination
            // For now, we'll use client-side pagination as implemented above
        }
    }, [sellerProduct.loading, paginatedProducts.length, totalProducts]);

    return (
        <>
            <TableContainer
                ref={tableContainerRef}
                component={Paper}
                onScroll={handleScroll}
                sx={{
                    maxHeight: "calc(100vh - 250px)", // Adjusted for pagination
                    overflow: "auto",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Table sx={{ minWidth: 700 }} stickyHeader aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Product Images</StyledTableCell>
                            <StyledTableCell align="right">Title</StyledTableCell>
                            <StyledTableCell align="right">MRP Price</StyledTableCell>
                            <StyledTableCell align="right">Selling Price</StyledTableCell>
                            <StyledTableCell align="right">Color</StyledTableCell>
                            <StyledTableCell align="right">Update Stock</StyledTableCell>
                            <StyledTableCell align="right">
                                Update Product
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {sellerProduct.loading && sellerProducts.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : sellerProducts.length > 0 ? (
                        <TableBody>
                            {paginatedProducts.map((product) => (
                                <StyledTableRow key={product.id} className="hover:bg-gray-100">
                                    {/* Images with Lazy Loading */}
                                    <StyledTableCell component="th" scope="row">
                                        <div className="flex gap-1">
                                            {product.images?.slice(0, 3).map((image, idx) => (
                                                <LazyImage
                                                    key={idx}
                                                    src={image}
                                                    alt={`${product.title} ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg light-thin-border"
                                                />
                                            ))}
                                            {product.images && product.images.length > 3 && (
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center light-thin-border">
                                                    <span className="text-sm text-gray-500">
                                                        +{product.images.length - 3}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </StyledTableCell>

                                    {/* Title */}
                                    <StyledTableCell align="right">
                                        <Tooltip title={product.title} arrow>
                                            <span className="line-clamp-2 max-w-[200px]">
                                                {product.title}
                                            </span>
                                        </Tooltip>
                                    </StyledTableCell>

                                    {/* Prices */}
                                    <StyledTableCell align="right">Rs. {product.mrpPrice}</StyledTableCell>
                                    <StyledTableCell align="right">Rs. {product.sellingPrice}</StyledTableCell>

                                    {/* Color */}
                                    <StyledTableCell align="right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: product.color || '#ccc' }}
                                            />
                                            <span>{product.color || 'N/A'}</span>
                                        </div>
                                    </StyledTableCell>

                                    {/* Quantity + Stock status */}
                                    <StyledTableCell align="right">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color={product.stocks > 0 ? "success" : "error"}
                                            sx={{ ml: 1 }}
                                        >
                                            {product.stocks > 0 ? `In Stock: ${product.stocks}` : `Out of Stock`}
                                        </Button>
                                    </StyledTableCell>

                                    {/* Actions */}
                                    <StyledTableCell align="right">
                                        <Tooltip
                                            title="Click to Edit"
                                            arrow
                                            slots={{ transition: Zoom }}
                                        >
                                            <IconButton
                                                onClick={() => {
                                                    handleOpenModal();
                                                    setSelectProductForUpdate(product);
                                                }}
                                                disabled={sellerProduct.loading}
                                            >
                                                <EditRounded className="text-primary-color" />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}

                            {/* Loading more rows for infinite scroll */}
                            {sellerProduct.loading && paginatedProducts.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                            <CircularProgress size={24} />
                                            <span className="ml-2">Loading more products...</span>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <span className="text-lg font-bold text-gray-700">
                                        Your product list is empty. Added products will be shown here.
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {sellerProducts.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalProducts}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '1px solid #e0e0e0',
                        '.MuiTablePagination-toolbar': {
                            minHeight: '60px',
                        }
                    }}
                />
            )}

            {/* Update Product Modal */}
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
                        {selectProductForUpdate ? (
                            <UpdateProductModel
                                onClose={handleCloseModal}
                                productUpdate={selectProductForUpdate}
                            />
                        ) : (
                            <Alert icon={<ErrorRounded fontSize="inherit" />} severity="error">
                                Something went wrong with product data. Refresh the page or try again later.
                            </Alert>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}