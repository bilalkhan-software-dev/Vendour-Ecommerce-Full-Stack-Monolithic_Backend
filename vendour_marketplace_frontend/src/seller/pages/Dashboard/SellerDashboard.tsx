import { useState } from "react";
import { Drawer, IconButton, Box } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SellerRoutes from "../../../Routes/SellerRoutes";
import SellerDrawerList from "../../component/SellerDrawerList/SellerDrawerList";

const SellerDashboard = () => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <>
            <div className="lg:flex lg:h-[90vh] relative">
                {/* Sidebar for Desktop */}
                <section className="hidden md:block h-full">
                    <SellerDrawerList toggle={toggle} />
                </section>

                {/* Mobile Drawer Button */}
                <div className="block md:hidden fixed top-[70px] left-2 z-50">
                    <IconButton
                        onClick={toggle}
                        sx={{
                            backgroundColor: "white",
                            boxShadow: 2,
                            "&:hover": { backgroundColor: "grey.100" },
                        }}
                    >
                        <MenuRoundedIcon color="primary" />
                    </IconButton>
                </div>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={toggle}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: 305,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Box className="flex justify-between items-center p-3 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">Seller Menu</h2>
                        <IconButton onClick={toggle}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                    <SellerDrawerList toggle={toggle} />
                </Drawer>

                {/* Main Content */}
                <section className="p-10 w-full lg:w-[80%] overflow-y-auto">
                    <SellerRoutes />
                </section>
            </div>
        </>
    );
};

export default SellerDashboard;
