import { Divider } from "@mui/material";
import type { PricingCardProps } from "../../../types/props";

const PricingCard = ({ cart }: PricingCardProps) => {
    console.log('cart: ',cart);
    
    return (
        <>
            <div className='space-y-3 p-5 text-md'>
                <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span>Rs. {cart.totalSellingPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Discount</span>
                    <span>{cart.discount}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Platform Fee</span>
                    <span>Free</span>
                </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center p-5 text-primary-color">
                <span>Total</span>
                <span>Rs. {cart.totalSellingPrice}</span>
            </div>
        </>
    );
};

export default PricingCard;