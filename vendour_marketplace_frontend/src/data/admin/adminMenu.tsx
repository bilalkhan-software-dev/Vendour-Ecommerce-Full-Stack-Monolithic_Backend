import {
  AccountBoxRounded,
  AddRounded,
  DashboardRounded,
  IntegrationInstructionsRounded,
  LocalOfferRounded,
  LogoutRounded,
  SettingsSuggestRounded
} from "@mui/icons-material";

export const adminMenu1 = [
  {
    id: 1,
    name: "Dashboard",
    path: "/admin/",
    icon: <DashboardRounded className="text-primary-color" />,
    activeIcon: <DashboardRounded className="text-white" />,
  },
  {
    id: 2,
    name: "Coupons",
    path: "/admin/coupons",
    icon: <IntegrationInstructionsRounded className="text-primary-color" />,
    activeIcon: <IntegrationInstructionsRounded className="text-white" />,
  },
  {
    id: 3,
    name: "Add Coupons",
    path: "/admin/add-coupon",
    icon: <AddRounded className="text-primary-color" />,
    activeIcon: <AddRounded className="text-white" />,
  }, {
    id: 4,
    name: "Manage Home",
    path: "/admin/manage/home",
    icon: <SettingsSuggestRounded className="text-primary-color" />,
    activeIcon: <SettingsSuggestRounded className="text-white" />,
  },
  // {
  //   id: 5,
  //   name: "Electronics Category",
  //   path: "/admin/electronic-category",
  //   icon: <ElectricBoltRounded className="text-primary-color" />,
  //   activeIcon: <ElectricBoltRounded className="text-white" />,
  // },
  // {
  //   id: 6,
  //   name: "Shop by Category",
  //   path: "/admin/shop-by-category",
  //   icon: <CategoryRounded className="text-primary-color" />,
  //   activeIcon: <CategoryRounded className="text-white" />,
  // },
  {
    id: 7,
    name: "Deals",
    path: "/admin/deals",
    icon: <LocalOfferRounded className="text-primary-color" />,
    activeIcon: <LocalOfferRounded className="text-white" />,
  },
];

export const adminMenu2 = [
  {
    id: 1,
    name: "Profile",
    path: "/admin/profile",
    icon: <AccountBoxRounded className="text-primary-color" />,
    activeIcon: <AccountBoxRounded className="text-white" />,
  },
  {
    id: 2,
    name: "Logout",
    path: "/admin/logout",
    icon: <LogoutRounded className="text-primary-color" />,
    activeIcon: <LogoutRounded className="text-white" />,
  },
];
