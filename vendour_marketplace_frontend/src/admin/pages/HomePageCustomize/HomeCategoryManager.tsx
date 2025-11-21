import { useState } from "react";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import {
    Box,
    Button,
    CircularProgress,
    Fade,
    IconButton,
    Modal,
    Tooltip,
    keyframes,
} from "@mui/material";
import { homeCategoryManagerTabs } from "../../../data/admin/data";
import HomeGrid from "./HomeGrid";
import ElectronicCategory from "./ElectronicCategory";
import ShopByCategory from "./ShopByCategory";
import CreateHomeCategoryModal from "./CreateHomeCategoryModal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
    createHomeCategories,
    fetchAllHomePageData,
} from "../../../redux/slice/admin/adminHomePageCustomizationSlice";
import { homeCategory } from "../../../data/homeCategory/homeCategory";
import { RefreshRounded } from "@mui/icons-material";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const HomeCategoryManager = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Home Grid");
    const dispatch = useAppDispatch();
    const home = useAppSelector((store) => store.home.homeData);
    const adminHome = useAppSelector((store) => store.adminHomeCustomization);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "info",
    });

    const handleOpenModal = (tab: string) => {
        if (tab === "Add New Home Category") setOpen(true);
    };

    const handleCloseModal = () => setOpen(false);

    // Smooth tab transition
    const [tabTransition, setTabTransition] = useState(true);
    const handleTabChange = (tab: string) => {
        if (tab === activeTab) {
            handleOpenModal(tab);
            return;
        }
        setTabTransition(false);
        setTimeout(() => {
            setActiveTab(tab);
            handleOpenModal(tab);
            setTabTransition(true);
        }, 200);
    };

    const handleHomeCreateCategories = () => {
        dispatch(createHomeCategories({ homeCategoryRequest: homeCategory }));
    };

    const handleRefresh = () => {
        dispatch(fetchAllHomePageData());
    };

    return (
        <>
            {/* Tabs Section */}
            <div className="flex flex-wrap gap-3 relative">
                {homeCategoryManagerTabs.map((tab) => (
                    <Button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        variant={activeTab === tab ? "contained" : "outlined"}
                        sx={{
                            textTransform: "none",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            backgroundColor: activeTab === tab ? "primary.main" : "transparent",
                            color: activeTab === tab ? "#fff" : "text.primary",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {/* No Categories Warning */}
            {(home?.dealCategories?.length === 0 ||
                home?.electronicCategories?.length === 0 ||
                home?.shopByCategory?.length === 0) && (
                    <div className="mt-6 text-center">
                        <p className="text-primary-color italic text-lg mb-3">
                            It looks like you currently don’t have any categories. <br />
                            Click below to bulk-create home categories, then modify as needed.
                        </p>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={home?.electronicCategories?.length > 0}
                            onClick={handleHomeCreateCategories}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                p: 2,
                            }}
                        >
                            {adminHome.loading ? <CircularProgress size={24} /> : "Create Categories"}
                        </Button>
                    </div>
                )}

            {/* Smooth Tab Content Transition */}
            <div
                className={`mt-6 transition-all duration-300 ${tabTransition ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
            >
                {activeTab === "Home Grid" && <HomeGrid />}
                {activeTab === "Electronics Categories" && <ElectronicCategory />}
                {activeTab === "Shop By Categories" && <ShopByCategory />}
            </div>

            {/* Refresh Button */}
            <div className="absolute top-10 right-10 md:top-10 md:right-16">
                <Tooltip title="Refresh Data" arrow placement="left">
                    <IconButton onClick={handleRefresh}>
                        {adminHome.loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    animation: `${spin} 1s linear infinite`,
                                }}
                            >
                                <RefreshRounded />
                            </Box>
                        ) : (
                            <RefreshRounded />
                        )}
                    </IconButton>
                </Tooltip>
            </div>

            {/* Snackbar */}
            <SnackbarMessage
                open={snackbar.open}
                severity={snackbar.severity}
                message={snackbar.message}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />

            {/* Modal for Adding Categories */}
            <Modal
                aria-labelledby="update-category-modal"
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "95%", sm: 500 },
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 24,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            p: 4,
                            outline: "none",
                        }}
                        className="hide-scrollbar"
                    >
                        <CreateHomeCategoryModal
                            onClose={handleCloseModal}
                            setSnackbar={setSnackbar}
                        />
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default HomeCategoryManager;
