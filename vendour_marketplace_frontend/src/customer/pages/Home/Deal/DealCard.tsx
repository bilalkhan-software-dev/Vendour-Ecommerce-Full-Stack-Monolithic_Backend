import { LocalOfferRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type DealCardProps = {
    title: string;
    image: string;
    categoryId: string;
    discountPercent?: number;
};

const DealCard = ({ title, image, discountPercent, categoryId }: DealCardProps) => {

    const navigate = useNavigate();

    return (
        <div className="relative w-[13rem] sm:w-[15rem] lg:w-[16rem] cursor-pointer transition-transform duration-300 hover:scale-105">
            {/* Product Image */}
            <div className="relative"
                onClick={() => navigate(`/products/category/${title}/${categoryId}`)}
            >


            <img
                src={image}
                alt={title}
                className="w-full h-[12rem] object-cover object-top rounded-t-lg border-2 border-green-600"
            />
            {discountPercent && (
                <div className="absolute -top-1 -right-2 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    <LocalOfferRounded sx={{ fontSize: 14 }} />
                    {discountPercent}%
                </div>
            )}
        </div>

            {/* Details */ }
    <div className="bg-black text-white p-3 rounded-b-lg border-2 border-green-600 border-t-0">
        <p className="text-lg font-semibold truncate">{title}</p>
        <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-green-400">
                {discountPercent ? `${discountPercent}% Off` : ""}
            </span>
        </div>
        {/* {discountPercent && (
                    <p className="flex items-center gap-1 text-xs text-gray-300 mt-2 line-through">
                        <span style={{ fontSize: 14 }}>Rs. </span>
                        {price.toLocaleString()}
                    </p>
                )}

                <p className="flex items-center gap-1 text-sm font-bold">
                    <span style={{ fontSize: 14 }}>Rs. </span>
                    {discountPrice.toLocaleString()}
                </p> */}

    </div>
        </div >
    );
};

export default DealCard;
