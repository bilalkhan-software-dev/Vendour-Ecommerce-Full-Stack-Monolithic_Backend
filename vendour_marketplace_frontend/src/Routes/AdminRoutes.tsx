import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Coupon from "../admin/pages/Coupon/Coupon";
import AddNewCoupon from "../admin/pages/Coupon/AddNewCoupon";
import HomeGrid from "../admin/pages/HomePageCustomize/HomeGrid";
import ElectronicCategory from "../admin/pages/HomePageCustomize/ElectronicCategory";
import ShopByCategory from "../admin/pages/HomePageCustomize/ShopByCategory";
import Deals from "../admin/pages/HomePageCustomize/Deal/Deals";
import Profile from "../admin/pages/Profile/Profile";
import Sellers from "../admin/pages/Seller/Sellers";
import { useAppDispatch } from "../redux/store";
import { logout } from "../redux/slice/authSlice";
import { logoutCoupon } from "../redux/slice/admin/couponSlice";
import Swal from 'sweetalert2';
import CreateHomeCategoryModal from "../admin/pages/HomePageCustomize/CreateHomeCategoryModal";
import HomeCategoryManager from "../admin/pages/HomePageCustomize/HomeCategoryManager";

const AdminRoutes = () => {

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();



  const handleLogout = async () => {
    await dispatch(logout({ navigate: navigate }))
    await dispatch(logoutCoupon({ navigate: navigate }))

  }
  const handleLogoutWithConfirm = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You need to login again!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Logging out...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      await handleLogout();

      Swal.fire('Logout!', 'Logout Successfully.', 'success').then(() => {
        window.location.reload();
      });
    }
  };

  if (location.pathname === "/admin/logout") {
    handleLogoutWithConfirm();
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Sellers />} />
        <Route path="/coupons" element={<Coupon />} />
        <Route path="/add-coupon" element={<AddNewCoupon />} />
        <Route path="/manage/home" element={<HomeCategoryManager />} />
        {/* <Route path="/electronic-category" element={<ElectronicCategory />} /> */}
        {/* <Route path="/shop-by-category" element={<ShopByCategory />} /> */}
        <Route path="/deals" element={<Deals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" />
      </Routes>
    </>
  );
};

export default AdminRoutes;