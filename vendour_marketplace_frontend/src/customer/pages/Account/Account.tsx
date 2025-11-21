import { Divider } from "@mui/material";
import { menu } from "../../../data/account/customerAccount";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Orders from "./Orders";
import UserDetails from "./UserDetails";
import OrderDetails from "./OrderDetails";
import { Home } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { logout } from "../../../redux/slice/authSlice";
import { logoutCart } from "../../../redux/slice/customer/cartSlice";
import AddressCard from "./AddressCard";
import MyReviews from "./MyReviews";

type MenuItem = {
    name: string;
    path: string;
};

const Account = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    const handleMenuNavigate = (e: MenuItem) => {

        if (e.path === '/logout') {
            dispatch(logout({ navigate }))
            dispatch(logoutCart({ navigate }))
            return;
        }
        navigate(e.path)
    }

    const userName = auth.user?.fullName ?? "Currently you are not login";

    return (
        <>
            <div className='px-5 lg:px-52 min-h-screen mt-10'>
                <div>
                    <h1 className="text-lg font-bold pb-5 italic text-primary-color md:text-3xl">{userName}</h1>
                </div>
                <Divider />
                <div className="grid grid-cols-1  lg:grid-cols-3 lg:min-h-[78vh]">
                    {/* Left Menu section */}
                    <section className="col-span-1 lg:border-r border-gray-200/100 lg:pr-5 py-5 h-full">
                        {
                            menu.map((item) =>
                                <div
                                    onClick={() => handleMenuNavigate(item)}
                                    key={item.name}
                                    className={`duration-200 ${item.path === location.pathname ? 'bg-primary-color text-white' : ''}
                            py-3 cursor-pointer hover:text-white hover:bg-primary-color px-5 rounded-md border-b border-gray-200/100`}
                                >
                                    <p>{item.name}</p>
                                </div>
                            )
                        }
                    </section>
                    {/* Content of the menu according to path */}
                    <section className="lg:col-span-2 lg:pl-5 py-5">
                        <Routes>
                            <Route path="/" element={<UserDetails />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/order/:orderId/:orderItemId" element={<OrderDetails />} />
                            <Route path="/addresses" element={<AddressCard />} />
                            <Route path="/my/reviews" element={<MyReviews />} />
                            <Route path="/logout" element={<Home />} />
                        </Routes>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Account;