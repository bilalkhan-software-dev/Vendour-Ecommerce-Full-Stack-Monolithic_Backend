import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Products from "../seller/pages/Product/Products";
import Dashboard from "../seller/pages/Dashboard/Dashboard";
import AddProduct from "../seller/pages/Product/AddProduct";
import Orders from "../seller/pages/Orders/Orders";
import Profile from "../seller/pages/Account/Profile";
import Payment from "../seller/pages/Payment/Payment";
import Transaction from "../seller/pages/Payment/Transaction";

import Swal from 'sweetalert2';
import { useAppDispatch } from "../redux/store";
import { logout } from "../redux/slice/seller/sellerAuthSlice";



const SellerRoutes = () => {



    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();



    const handleLogout = async () => {
        await dispatch(logout({ navigate: navigate }))
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

    if (location.pathname === "/seller/logout") {
        handleLogoutWithConfirm();
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Profile />} />
                <Route path="/payments" element={<Payment />} />
                <Route path="/transactions" element={<Transaction />} />

                <Route path="/logout" />
            </Routes>
        </>
    );
};

export default SellerRoutes;