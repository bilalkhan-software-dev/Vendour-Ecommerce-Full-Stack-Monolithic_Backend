import { ThemeProvider } from "@emotion/react";
import Navbar from "./customer/component/Navbar/Navbar";
import customTheme from "./Theme/customTheme";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import BecomeSeller from "./customer/pages/Become Seller/BecomeSeller";
import Footer from "./customer/component/Footer/Footer";
import CustomerRoutes from "./Routes/CustomerRoutes";
import SellerDashboard from "./seller/pages/Dashboard/SellerDashboard";
import AdminDashboard from "./admin/pages/Dashboard/AdminDashboard";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import { fetchSellerProfile } from "./redux/slice/seller/sellerSlice";
import { fetchUserProfile } from "./redux/slice/authSlice";
import SellerNavbar from "./seller/component/Navbar/SellerNavbar";
import { fetchAllHomePageData } from "./redux/slice/homePageSlice";
import VerifySeller from "./customer/pages/Checkout(Order)/VerifySeller/VerifySeller";
import NotFoundPage from "./component/NotFound/NotFoundPage";
import HomeSkeleton from "./component/skeleton/HomePageSkeleton";
import { Button } from "@mui/material";

const App = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(store => store.auth);
  const seller = useAppSelector(store => store.seller);
  const token = localStorage.getItem("jwt");
  const home = useAppSelector(store => store.home);



  useEffect(() => {
    dispatch(fetchAllHomePageData());
  }, [dispatch]);


  useEffect(() => {
    if (token && !seller.profile) dispatch(fetchSellerProfile());
  }, [token, dispatch, seller.profile]);

  useEffect(() => {
    if (token && !auth.user) dispatch(fetchUserProfile());
  }, [token, dispatch, auth.user]);

  useEffect(() => {
    if (!token) return;

    if (seller.profile && !location.pathname.startsWith("/seller")) {
      navigate("/seller/");
    } else if (auth.user?.role === "ROLE_ADMIN" && !location.pathname.startsWith("/admin")) {
      navigate("/admin/");
    }
  }, [token, seller.profile, auth.user, location.pathname, navigate]);




  const renderNavbar = () => {
    if (location.pathname.includes("/seller") || location.pathname.includes("/admin")) {
      return <SellerNavbar />;
    }
    return <Navbar />;
  };

  const renderFooter = () => {
    if (!location.pathname.includes("/seller") && !location.pathname.includes("/admin") && !location.pathname.includes("/become-seller")) {
      return <Footer />;
    }
  };




  if (home.loading) {
    return <>
      <HomeSkeleton />
    </>
  }

  if (home.error) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gray-50 ">
        <div className="flex flex-col items-center bg-white  shadow-lg rounded-2xl p-8 max-w-sm text-center">
          <h2 className="text-xl font-semibold text-gray-800 ">
            Something went wrong
          </h2>
          <p className="text-gray-600  mt-2 mb-6">
            {"An unexpected error occurred. Please try again."}
          </p>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }



  return (
    <ThemeProvider theme={customTheme("light")}>
      <div className="h-screen pb-20 flex flex-col">
        {renderNavbar()}
        <Routes>
          <Route path="/*" element={<CustomerRoutes />} />
          <Route path="/shop/*" element={<CustomerRoutes />} />
          <Route path="/profile/*" element={<CustomerRoutes />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller/*" element={<SellerDashboard />} />
          <Route path="/verify-email/:email/:otp" element={<VerifySeller />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* <div className="mt-20 bottom-0 w-full">
          {renderFooter()}
        </div> */}
      </div>
    </ThemeProvider>

  );
};

export default App;
