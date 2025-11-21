import { electronicsLevelThree } from "../data/category/level three/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../data/category/level three/homeFurnitureLevelThree";
import { menLevelThree } from "../data/category/level three/menLevelThree";
import { womenLevelThree } from "../data/category/level three/womenLevelThree";
import { electronicsLevelTwo } from "../data/category/level two/electronicsLevelTwo";
import { homeFurnitureLevelTwo } from "../data/category/level two/homeFurnitureLevelTwo";
import { menLevelTwo } from "../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../data/category/level two/womenLevelTwo";

export interface CategoryItem {
    categoryId: string;
    name: string;
    parentCategoryId?: string;
}

interface CategoryLevels {
    [key: string]: CategoryItem[];
}


export const categoryLevelTwo: CategoryLevels = {
    men: menLevelTwo,
    women: womenLevelTwo,
    home_furniture: homeFurnitureLevelTwo,
    electronics: electronicsLevelTwo
};
export const categoryLevelThree: CategoryLevels = {
    men: menLevelThree,
    women: womenLevelThree,
    home_furniture: homeFurnitureLevelThree,
    electronics: electronicsLevelThree
};