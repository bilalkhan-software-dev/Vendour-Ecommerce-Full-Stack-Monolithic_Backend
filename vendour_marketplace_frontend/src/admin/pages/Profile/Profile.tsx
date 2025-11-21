import { CircularProgress, Divider } from "@mui/material";
import ProfileFieldCard from "../../../component/ProfileFieldCard/ProfileFieldCard";
import { fetchUserProfile } from "../../../redux/slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useEffect, useState } from "react";
import type { SnackbarProps } from "../../../types/props";

const Profile = () => {

  const dispatch = useAppDispatch();
  const user = useAppSelector(store => store.auth.user);
  const loading = useAppSelector(store => store.auth.loading);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {

    const fetchProfile = async () => {
      if (!user) {
        const result = await dispatch(fetchUserProfile())

        if (fetchUserProfile.rejected.match(result)) {
          setSnackbar({
            open: true,
            message: result.payload || "Unable to fetch profile, Please try again later",
            severity: "error"
          })
        }
      }
    }

    fetchProfile();

  }, [dispatch, user])


  if (loading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <CircularProgress />
      </div>)
  }
  return (
    <>
      <div className='flex justify-center'>
        <div className="w-full lg:w-[70%]">
          <h1 className="text-2xl font-bold italic text-primary-color text-center mb-6">
            Admin Information Multivendour Ecommerce
          </h1>
          <div className="hover:shadow-xl p-5 rounded-md border border-gray-200">
            <ProfileFieldCard keys="Name" value={user?.fullName} />
            <Divider />
            <ProfileFieldCard keys="Email" value={user?.email} />
            <Divider />
            <ProfileFieldCard keys="Account Type" value={user?.role.substring(5) ?? 'Unknown type'} />
            <Divider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;