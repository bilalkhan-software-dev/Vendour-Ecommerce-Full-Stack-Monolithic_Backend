import { useState } from "react";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";
import { Button } from "@mui/material";
import becomeSellerShoppingLogo from "../../../assets/pics/become-seller-shopping.jpg";

const BecomeSeller = () => {

    const [isLogin, setIsLogin] = useState<boolean>(false);

    const handleShowPage = () => {
        setIsLogin(!isLogin)
    }

    return (
        <>
            <div className='grid md:gap-10 grid-cols-3 min-h-screen'>

                {/* Login and Form section */}
                <section className="col-span-3 md:col-span-1 lg:col-span-1 p-10 shadow-2xl rounded-b-md">
                    {!isLogin ?
                        <SellerAccountForm /> : <SellerLoginForm />
                    }
                    <div className="mt-10 space-y-2">
                        <h1 className="text-center text-sm font-medium shadow-2xl/55">
                            {isLogin ? 'Don\'t Have account?' : 'Already have account?'}
                        </h1>
                        <Button
                            onClick={handleShowPage}
                            fullWidth
                            variant="outlined"
                            className="rounded-md"
                            sx={{ py: '11px' }}>
                            {isLogin ? 'Register' : 'Login'}
                        </Button>
                    </div>
                </section>

                {/* Right side image section hidden on Mobile */}
                <section className="hidden md:col-span-1 lg:col-span-2  md:flex justify-center items-center">
                    <div className="lg:w-[70%] space-y-10 px-5 text-center ">
                        <div className="space-y-2 font-bold text-center">
                            <p className="text-2xl pt-5 italic text-gray-500/100">Join the Vendour Marletpace</p>
                            <p className="text-primary-color text-lg">Boost your Sales</p>
                        </div>
                        <img
                            src={becomeSellerShoppingLogo}
                            className="rounded-md w-full justify-center text-center object-top "
                            alt="Become-Seller-Shopping-Logo" />
                    </div>
                </section>
            </div>
        </>
    );
};

export default BecomeSeller;