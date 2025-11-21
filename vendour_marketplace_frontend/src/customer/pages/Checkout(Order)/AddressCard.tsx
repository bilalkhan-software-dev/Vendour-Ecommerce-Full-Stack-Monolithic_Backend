import { Radio } from "@mui/material";
import { HomeRounded, LocationOnRounded, PhoneRounded } from "@mui/icons-material";
import type { Address } from "../../../types/seller";

interface AddressCardProps {
    address: Address;
    selected: boolean;
    onSelect: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
    address,
    selected,
    onSelect,
}) => {
    return (
        <div
            className={`p-5 rounded-md flex mb-4 light-thin-border cursor-pointer transition-all duration-200 
        ${selected ? "border-green-500 border-2 shadow-md" : "hover:border-green-400"}`}
            onClick={onSelect}
        >
            {/* Radio Button */}
            <div className="flex items-start pr-2">
                <Radio
                    checked={selected}
                    onChange={onSelect}
                    value={address.locality}
                    name="address-select"
                    color="primary"
                />
            </div>

            {/* Address Info */}
            <div className="space-y-2 pt-2">
                <h1 className="font-semibold flex text-[12px] md:text-sm items-center gap-2 text-gray-800">
                    <HomeRounded fontSize="small" className="text-primary-color" />
                    {address.name}
                </h1>
                <p className="flex items-center gap-2 text-[12px] md:text-sm text-wrap text-gray-700">
                    <LocationOnRounded fontSize="small" className="text-red-500" />
                    {`${address.address}, ${address.locality}, ${address.city}, ${address.state}`}
                </p>
                <p className="flex items-center gap-2 text-[12px] md:text-sm text-gray-700">
                    <PhoneRounded fontSize="small" className="text-green-500" />
                    {address.mobile}
                </p>
            </div>
        </div>
    );
};

export default AddressCard;
