import { useState } from "react";
import { Drawer, IconButton, Box } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AdminRoutes from "../../../Routes/AdminRoutes";
import AdminDrawerList from "../../component/AdminDrawerList/AdminDrawerList";

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="lg:flex lg:h-[100vh] relative bg-gray-50">
      {/* SIDEBAR FOR DESKTOP */}
      <section className="hidden md:block h-full lg:w-[305px] bg-white border-r border-gray-200 shadow-sm">
        <AdminDrawerList toggle={toggleDrawer} />
      </section>

      {/* MOBILE DRAWER BUTTON */}
      <div className="block md:hidden fixed top-[75px] left-3 z-50">
        <IconButton
          onClick={toggleDrawer}
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "12px",
            padding: "10px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "grey.100",
              transform: "rotate(90deg) scale(1.1)",
            },
          }}
        >
          <MenuRoundedIcon color="primary" fontSize="medium" />
        </IconButton>
      </div>


      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 310,
            boxSizing: "border-box",
            borderRight: "1px solid #ddd",
            backgroundColor: "background.paper",
          },
        }}
      >
        <Box className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Admin Menu</h2>
          <IconButton onClick={toggleDrawer}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <AdminDrawerList toggle={toggleDrawer} />
      </Drawer>

      {/* MAIN CONTENT */}
      <section className="p-10 w-full lg:w-[80%] overflow-y-auto">
        <AdminRoutes />
      </section>
    </div>
  );
};

export default AdminDashboard;
