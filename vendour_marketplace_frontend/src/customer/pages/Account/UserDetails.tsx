import { Divider } from "@mui/material";
import ProfileFieldCard from "../../../component/ProfileFieldCard/ProfileFieldCard";
import { useAppSelector } from "../../../redux/store";

const UserDetails = () => {

    const { auth } = useAppSelector(store => store);

    const user = auth?.user;






    return (
        <>
            <div className='flex justify-center py-10'>
                <div className="w-full lg:w-[70%]">
                    <div className="flex items-center pb-3 justify-between">
                        <h1 className="text-2xl font-bold text-gray-600">
                            Personal Details
                        </h1>
                    </div>
                    <div>
                        <ProfileFieldCard keys="Name" value={user?.fullName ?? "Unknown user"} />
                        <Divider />
                        <ProfileFieldCard keys="Email" value={user?.email ?? "Unknown email"} />
                        <Divider />
                        <ProfileFieldCard keys="Account type: " value={user?.role.substring(5) ?? 'Unknown type'} />
                        <Divider />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;