import { Box } from "@mui/material";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../../../data/category/level three/homeFurnitureLevelThree";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { electronicsLevelTwo } from "../../../data/category/level two/electronicsLevelTwo";
import { homeFurnitureLevelTwo } from "../../../data/category/level two/homeFurnitureLevelTwo";
import { menLevelTwo } from "../../../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level two/womenLevelTwo";
import { useNavigate } from "react-router-dom";

// Define types for our categories
interface CategoryItem {
    categoryId: string;
    name: string;
    parentCategoryId?: string;
}

interface CategoryLevels {
    [key: string]: CategoryItem[];
}

interface MegaMenuCategorySheetProps {
    selectedCategory: string;
}

const categoryLevelTwo: CategoryLevels = {
    men: menLevelTwo,
    women: womenLevelTwo,
    home_furniture: homeFurnitureLevelTwo,
    electronics: electronicsLevelTwo
};
const categoryLevelThree: CategoryLevels = {
    men: menLevelThree,
    women: womenLevelThree,
    home_furniture: homeFurnitureLevelThree,
    electronics: electronicsLevelThree
};

const MegaMenuCategorySheet = ({ selectedCategory }: MegaMenuCategorySheetProps) => {

    const navigate = useNavigate();

    const levelTwoCategories = categoryLevelTwo[selectedCategory] || [];
    const levelThreeCategories = categoryLevelThree[selectedCategory] || [];

    const getChildCategories = (parentCategoryId: string) => {
        return levelThreeCategories.filter((child: CategoryItem) =>
            child.parentCategoryId === parentCategoryId
        );
    };

    // Show message if no categories are found
    if (levelTwoCategories.length === 0) {
        return (
            <Box sx={{ zIndex: 1600 }} className="bg-white shadow-lg lg:h-[500px] overflow-y-auto flex items-center justify-center">
                <div className="text-gray-500">No categories found for {selectedCategory}</div>
            </Box>
        );
    }

    return (
        <Box sx={{ zIndex: 1600 }} className="bg-white shadow-lg lg:h-[500px] overflow-y-auto rounded-xl">
            <div className="flex flex-wrap text-sm">
                {levelTwoCategories.map((item, index) => {
                    const childCategories = getChildCategories(item.categoryId);

                    return (
                        <div
                            key={item.categoryId}
                            className={`p-6 lg:w-1/5 md:w-1/3 sm:w-1/2 rounded-md ${index % 2 === 0 ? "bg-slate-100" : "bg-white"}`}
                        >
                            <p className="text-primary-color mb-4 font-semibold text-base">
                                {item.name}
                            </p>

                            {childCategories.length > 0 ? (
                                <ul className="space-y-2">
                                    {childCategories.map((childItem: CategoryItem) => (
                                        <li
                                            onClick={() => navigate(`/products/category/${childItem.name}/${childItem.categoryId}`)}
                                            key={childItem.categoryId}
                                            className="hover:text-primary-color cursor-pointer transition-colors duration-200"
                                        >
                                            {childItem.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm">No subcategories</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Box>
    );
};

export default MegaMenuCategorySheet;