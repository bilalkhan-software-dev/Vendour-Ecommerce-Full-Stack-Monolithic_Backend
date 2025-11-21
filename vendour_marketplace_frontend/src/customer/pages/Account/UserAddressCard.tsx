import type { Address } from "../../../types/seller";
import { HomeRounded, PhoneRounded } from "@mui/icons-material";

interface UserAddressCardProps {
    address: Address;
}

const UserAddressCard = ({ address }: UserAddressCardProps) => {
    return (
        <div
            className="p-5 rounded-2xl border border-gray-200 
                 bg-white  shadow-sm hover:shadow-md 
                 transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <HomeRounded className="text-primary-color" fontSize="small" />
                <h2 className="font-semibold text-lg text-gray-800">
                    {address.name ?? "Home Address"}
                </h2>
            </div>

            {/* Address details */}
            <div className="space-y-1 text-gray-700">
                <p>
                    {address.locality}, {address.city}
                </p>
                <p>
                    {address.state}, {address.pinCode}
                </p>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 mt-4 text-gray-800">
                <PhoneRounded className="text-primary-color" fontSize="small" />
                <span className="text-sm font-medium">{address.mobile}</span>
            </div>
        </div>
    );
};

export default UserAddressCard;
