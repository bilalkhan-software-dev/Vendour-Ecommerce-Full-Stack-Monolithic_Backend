import { AccountBalanceRounded, AccountBoxRounded, AddRounded, DashboardRounded, InventoryRounded, LogoutRounded, ReceiptRounded, ShoppingBagRounded } from "@mui/icons-material";

export const menu = [
    {
        id: 1,
        name: 'Dashboard',
        path: "/seller/",
        icon: <DashboardRounded className="text-primary-color" />,
        activeIcon: <DashboardRounded className="text-white" />,
    }, {
        id: 2,
        name: 'Orders',
        path: "/seller/orders",
        icon: <ShoppingBagRounded className="text-primary-color" />,
        activeIcon: <ShoppingBagRounded className="text-white" />,
    }, {
        id: 3,
        name: 'Products',
        path: "/seller/products",
        icon: <InventoryRounded className="text-primary-color" />,
        activeIcon: <InventoryRounded className="text-white" />,
    }, {
        id: 4,
        name: 'Add Product',
        path: "/seller/add-product",
        icon: <AddRounded className="text-primary-color" />,
        activeIcon: <AddRounded className="text-white" />,
    }, {
        id: 5,
        name: 'Payments',
        path: "/seller/payments",
        icon: <AccountBalanceRounded className="text-primary-color" />,
        activeIcon: <AccountBalanceRounded className="text-white" />,
    }, {
        id: 6,
        name: 'Transactions',
        path: "/seller/transactions",
        icon: <ReceiptRounded className="text-primary-color" />,
        activeIcon: <ReceiptRounded className="text-white" />,
    }
];

export const menu2 = [
    {
        id: 1,
        name: 'Account',
        path: "/seller/account",
        icon: <AccountBoxRounded className="text-primary-color" />,
        activeIcon: <AccountBoxRounded className="text-white" />,
    },
    {
        id: 2,
        name: 'Logout',
        path: "/seller/logout",
        icon: <LogoutRounded className="text-primary-color" />,
        activeIcon: <LogoutRounded className="text-white" />,
    }
];
