import { useState } from "react";
import { tabs } from "../../../../data/admin/data";
import {
  Button,
  IconButton,
  Tooltip,
  Box,
  keyframes,
} from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDeal from "./CreateDeal";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { fetchAllHomePageData } from "../../../../redux/slice/admin/adminHomePageCustomizationSlice";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Deals = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  const [tabTransition, setTabTransition] = useState(true);
  const [rotating, setRotating] = useState(false);
  const dispatch = useAppDispatch();
  const adminHome = useAppSelector((store) => store.adminHomeCustomization);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setTabTransition(false);
    setTimeout(() => {
      setActiveTab(tab);
      setTabTransition(true);
    }, 200);
  };

  const handleRefresh = async () => {
    setRotating(true);
    await dispatch(fetchAllHomePageData());
    setTimeout(() => setRotating(false), 800); // smooth end
  };

  return (
    <div className="relative">
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? "contained" : "outlined"}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor:
                activeTab === tab ? "primary.main" : "transparent",
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

      {/* Smooth Fade Transition for Tab Content */}
      <div
        className={`mt-6 transition-all duration-300 ${tabTransition
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
          }`}
      >
        {activeTab === "Deals" && <DealTable />}
        {activeTab === "Category" && <DealCategoryTable />}
        {activeTab === "Create Deal" && <CreateDeal />}
      </div>

      {/* Refresh Button */}
      <div className="absolute top-0 right-10 ">
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
    </div>
  );
};

export default Deals;
