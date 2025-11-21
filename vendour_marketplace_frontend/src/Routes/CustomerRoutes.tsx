import { Route, Routes } from "react-router-dom";
import Home from "../customer/pages/Home/Home";
import Product from "../customer/pages/Product/Product";
import Review from "../customer/pages/Review/Review";
import ProductDetails from "../customer/pages/ProductDetails/ProductDetails";
import Cart from "../customer/pages/Cart/Cart";
import Checkout from "../customer/pages/Checkout(Order)/Checkout";
import Account from "../customer/pages/Account/Account";
import Authentication from "../customer/pages/Auth/Authentication";
import Wishlist from "../customer/pages/Wishlist/Wishlist";
import CheckoutSuccess from "../customer/pages/Checkout(Order)/CheckoutSuccess";
import CheckoutCancel from "../customer/pages/Checkout(Order)/CheckoutCancel";
import NotFoundPage from "../component/NotFound/NotFoundPage";

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/category/:categoryName/:categoryId" element={<Product />} />
            <Route path="/products/search/:productTitle/searching.../result" element={<Product />} />
            <Route path="/reviews/:productId" element={<Review />} />
            <Route path="/product-details/:productId/:categoryName/:categoryId" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default CustomerRoutes;
