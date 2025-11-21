import { useAppSelector } from "../../../redux/store";
import type { Address } from "../../../types/seller";
import UserAddressCard from "./UserAddressCard";

const AddressCard = () => {
    const { auth } = useAppSelector((store) => store);
    const addresses: Address[] = auth?.user?.address ?? [];
    console.log("Address: ", addresses)

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-primary-color">
                Saved Addresses
            </h2>

            {addresses?.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {addresses.map((address) => (
                        <UserAddressCard address={address} key={address.id} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 
                border border-dashed rounded-lg bg-gray-50 
                text-center">
                    <p className="text-gray-600  mb-4">
                        You currently don’t have any saved addresses.
                    </p>
                </div>

            )}
        </div>
    );
};

export default AddressCard;
