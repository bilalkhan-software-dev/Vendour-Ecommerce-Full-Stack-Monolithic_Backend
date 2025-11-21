import { Box, Collapse, List, ListItemButton, ListItemText, Toolbar, Tooltip } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../../../data/category/level three/homeFurnitureLevelThree";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { electronicsLevelTwo } from "../../../data/category/level two/electronicsLevelTwo";
import { homeFurnitureLevelTwo } from "../../../data/category/level two/homeFurnitureLevelTwo";
import { menLevelTwo } from "../../../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level two/womenLevelTwo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CategoryItem {
    categoryId: string;
    name: string;
    parentCategoryId?: string;
}

interface CategoryLevels {
    [key: string]: CategoryItem[];
}

interface MobileDrawerCategorySheetProps {
    selectedCategory: string;
}

const categoryLevelTwo: CategoryLevels = {
    men: menLevelTwo,
    women: womenLevelTwo,
    home_furniture: homeFurnitureLevelTwo,
    electronics: electronicsLevelTwo,
};

const categoryLevelThree: CategoryLevels = {
    men: menLevelThree,
    women: womenLevelThree,
    home_furniture: homeFurnitureLevelThree,
    electronics: electronicsLevelThree,
};

const MobileDrawerCategorySheet = ({ selectedCategory }: MobileDrawerCategorySheetProps) => {
    const navigate = useNavigate();
    const [openParent, setOpenParent] = useState<string | null>(null);

    const levelTwoCategories = categoryLevelTwo[selectedCategory] || [];
    const levelThreeCategories = categoryLevelThree[selectedCategory] || [];

    const getChildCategories = (parentCategoryId: string) =>
        levelThreeCategories.filter((child) => child.parentCategoryId === parentCategoryId);

    if (levelTwoCategories.length === 0) {
        return (
            <Box
                sx={{ zIndex: 1600 }}
                className="bg-white shadow-lg lg:h-[500px] overflow-y-auto flex items-center justify-center"
            >
                <div className="text-gray-500">No categories found for {selectedCategory}</div>
            </Box>
        );
    }

    return (
        <Box
            sx={{ zIndex: 1600 }}
            className="pl-6 bg-white shadow-lg lg:h-[500px] overflow-y-auto rounded-xl"
        >
            <List>
                {levelTwoCategories.map((item) => {
                    const childCategories = getChildCategories(item.categoryId);
                    const isOpen = openParent === item.categoryId;

                    return (
                        <div key={item.categoryId}>
                            <ListItemButton
                                onClick={() =>
                                    setOpenParent(isOpen ? null : item.categoryId)
                                }
                            >
                                <ListItemText primary={item.name} sx={{ fontFamily: 'cursive' }} />
                                {isOpen ?
                                    <Box className="" sx={{
                                        transition: 'all 0.25s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.05)',
                                            transform: 'rotate(180deg)',
                                        },
                                    }}>
                                        <Tooltip title='Expand less' arrow placement="right">
                                            <ExpandLess sx={{ color: "#1DB954" }} />
                                        </Tooltip>
                                    </Box>
                                    :
                                    <Box
                                        sx={{
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(0,0,0,0.05)',
                                                transform: 'rotate(180deg)',
                                            },
                                        }}
                                    >
                                        <Tooltip title='Expand more' arrow placement="right">

                                            <ExpandMore />
                                        </Tooltip>

                                    </Box>
                                }
                            </ListItemButton>

                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {childCategories.map((child) => (
                                        <ListItemButton
                                            key={child.categoryId}
                                            sx={{ pl: 4 }}
                                            onClick={() =>
                                                navigate(`/products/category/${child.name}/${child.categoryId}`)
                                            }
                                        >
                                            <ListItemText primary={child.name} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    );
                })}
            </List>
        </Box>
    );
};

export default MobileDrawerCategorySheet;
