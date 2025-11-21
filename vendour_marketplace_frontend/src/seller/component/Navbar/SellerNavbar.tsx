import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import {
    DashboardRounded,
    ShoppingBag,
    BarChartRounded,
    Logout,
    Menu as MenuIcon,
    Storefront,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const SellerNavbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleNavigate = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    return (
        <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "white",
                zIndex: 1500,
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "70px",
                    px: { xs: 2, sm: 4, md: 8 },
                }}
            >
                {/* LOGO / TITLE */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <h1
                        className="logo text-primary-color text-2xl md:text-4xl"
                    >
                        Vendor Marketplace
                    </h1>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default SellerNavbar;
