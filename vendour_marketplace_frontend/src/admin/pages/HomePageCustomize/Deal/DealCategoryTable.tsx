import { useAppSelector } from "../../../../redux/store";
import HomeCategoryTable from "../HomeCategoryTable";

const DealCategoryTable = () => {


    const home = useAppSelector(store => store.adminHomeCustomization.homePageCategories);


    return (
        <>
            <div className=''>
                <HomeCategoryTable data={home?.dealCategories ?? []} />
            </div>
        </>
    );
};

export default DealCategoryTable;