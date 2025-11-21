import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface DrawerListProps {
    menu: Array<{ id: number; name: string; path: string; icon: JSX.Element; activeIcon: JSX.Element }>;
    menu2: Array<{ id: number; name: string; path: string; icon: JSX.Element; activeIcon: JSX.Element }>;
    toggle: () => void;
}

const DrawerList = ({ menu, menu2, toggle }: DrawerListProps) => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className=''>
                <div className="flex flex-col justify-between h-[90vh] w-[300px] border-r  border-gray-200/100 py-5">
                    {/* First menu */}
                    <div className="space-y-2">
                        {
                            menu.map((item) => (
                                <div className="pr-9 cursor-pointer" key={item.id}
                                    onClick={() => navigate(item.path)}
                                >

                                    <div
                                        className={`${item.path === location.pathname
                                            ? 'bg-primary-color text-white'
                                            : 'text-primary-color'}
                                flex items-center px-5 duration-150 py-3 rounded-r-full hover:bg-${item.path === location.pathname ? 'primary-color' : 'gray'}-100 hover:border-r  hover:rounded-r-full hover:border-primary-color`}
                                    >
                                        <ListItemIcon>
                                            {item.path === location.pathname ? item.activeIcon : item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </div>
                                </div>

                            ))}
                    </div>
                    <Divider />
                    {/* Second menu */}
                    <div className="space-y-2">
                        {
                            menu2.map((item) => (
                                <div className="pr-9 cursor-pointer  " key={item.id}
                                    onClick={() => navigate(item.path)}
                                >

                                    <div
                                        className={`${item.path === location.pathname
                                            ? 'bg-primary-color text-white'
                                            : 'text-primary-color'}
                                flex items-center px-5 duration-150 py-3 rounded-r-full hover:bg-${item.path === location.pathname ? 'primary-color' : 'gray'}-100 hover:border-r  hover:rounded-r-full hover:border-primary-color`}
                                    >
                                        <ListItemIcon>
                                            {item.path === location.pathname ? item.activeIcon : item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </div>
                                </div>

                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DrawerList;