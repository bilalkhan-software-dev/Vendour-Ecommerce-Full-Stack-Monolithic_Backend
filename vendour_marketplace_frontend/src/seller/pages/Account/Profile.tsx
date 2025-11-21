import {
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  EditRounded,
  Person,
  Email,
  Phone,
  Business,
  MailOutline,
  Numbers,
  AccountBalance,
  AccountBalanceWallet,
  Badge,
  Home,
  LocationCity,
  Public,
  Map,
  Pin,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import ProfileFieldCard from "../../../component/ProfileFieldCard/ProfileFieldCard";
import { useEffect } from "react";
import { fetchSellerProfile } from "../../../redux/slice/seller/sellerSlice";

const Profile = () => {
  const profile = useAppSelector((store) => store.seller.profile);
  const loading = useAppSelector(store => store.seller.loading);
  const dispatch = useAppDispatch();

  const formatValue = (val?: string | number) => {
    if (val === undefined || val === null || val === "") return "—";
    return typeof val === "number" ? val.toString() : val;
  };

  useEffect(() => {

    if (profile) {
      return;
    }

    dispatch(fetchSellerProfile());

  }, [dispatch, profile])

  if (loading) {
    return (
      <>
        <div className="w-full h-[60vh] flex justify-center items-center">
          <CircularProgress />
        </div>
      </>
    )
  }




  return (
    <Box className="flex justify-center py-8 px-4">
      <Box className="w-full lg:w-[70%] space-y-6">
        {/* Header */}
        <Box className="flex items-center justify-between">
          <Typography variant="h5" className="font-bold text-gray-700">
            Seller Profile Overview
          </Typography>
          <Tooltip title="Edit Profile" >
            <IconButton color="primary">
              <EditRounded fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Info Card */}
        <Card
          className="rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
          sx={{ overflow: "hidden" }}
        >
          <CardContent className="space-y-6">
            {/* PERSONAL INFO */}
            <Typography
              variant="h6"
              className="font-semibold  text-primary-color border-l-4 border-primary-color pl-2"
            >
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Person className="text-blue-500" />}
                  keys="Name"
                  value={formatValue(profile?.name)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Email className="text-pink-500" />}
                  keys="Email"
                  value={formatValue(profile?.email)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Phone className="text-green-500" />}
                  keys="Mobile"
                  value={formatValue(profile?.mobile)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Badge className="text-purple-500" />}
                  keys="Sales Tax Reg. No."
                  value={formatValue(profile?.strn)}
                />
              </Grid>
            </Grid>

            <Divider className="my-4" />

            {/* BUSINESS INFO */}
            <Typography
              variant="h6"
              className="font-semibold text-primary-color border-l-4 border-primary-color pl-2"
            >
              Business Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Business className="text-blue-600" />}
                  keys="Business Name"
                  value={formatValue(profile?.sellerBusinessDetails?.businessName)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<MailOutline className="text-indigo-500" />}
                  keys="Business Email"
                  value={formatValue(profile?.sellerBusinessDetails?.businessEmail)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Phone className="text-teal-600" />}
                  keys="Business Mobile"
                  value={formatValue(profile?.sellerBusinessDetails?.businessMobileNumber)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Home className="text-gray-500" />}
                  keys="Business Address"
                  value={formatValue(profile?.sellerBusinessDetails?.businessAddress)}
                />
              </Grid>
            </Grid>

            <Divider className="my-4" />

            {/* BANK INFO */}
            <Typography
              variant="h6"
              className="font-semibold text-primary-color border-l-4 border-primary-color pl-2"
            >
              Bank Information
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<AccountBalanceWallet className="text-orange-500" />}
                  keys="Account Number"
                  value={formatValue(profile?.sellerBankDetails?.accountNumber)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<AccountBalance className="text-teal-500" />}
                  keys="Bank Name"
                  value={formatValue(profile?.sellerBankDetails?.bankName)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Numbers className="text-red-500" />}
                  keys="IBAN"
                  value={formatValue(profile?.sellerBankDetails?.iban)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Badge className="text-purple-600" />}
                  keys="Account Holder"
                  value={formatValue(profile?.sellerBankDetails?.accountHolderName)}
                />
              </Grid>
            </Grid>

            <Divider className="my-4" />

            {/* PICKUP ADDRESS */}
            <Typography
              variant="h6"
              className="font-semibold text-primary-color border-l-4 border-primary-color pl-2"
            >
              Pickup Address
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Home className="text-gray-700" />}
                  keys="Name"
                  value={formatValue(profile?.pickupAddress?.name)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Phone className="text-green-600" />}
                  keys="Mobile"
                  value={formatValue(profile?.pickupAddress?.mobile)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<LocationCity className="text-orange-500" />}
                  keys="City"
                  value={formatValue(profile?.pickupAddress?.city)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Public className="text-blue-400" />}
                  keys="State"
                  value={formatValue(profile?.pickupAddress?.state)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Map className="text-indigo-400" />}
                  keys="Locality"
                  value={formatValue(profile?.pickupAddress?.locality)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ProfileFieldCard
                  icon={<Pin className="text-red-400" />}
                  keys="Pin Code"
                  value={formatValue(profile?.pickupAddress?.pinCode)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <ProfileFieldCard
                  icon={<Home className="text-gray-500" />}
                  keys="Full Address"
                  value={formatValue(profile?.pickupAddress?.address)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
