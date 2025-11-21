import { useAppSelector } from "../../../redux/store";
import HomeCategoryTable from "./HomeCategoryTable";

const HomeGrid = () => {

  const home = useAppSelector(store => store.adminHomeCustomization.homePageCategories);


  return (
    <>
      <div className="text-center font-semibold italic md:text-2xl text-primary-color p-4">Home Grid Customization</div>
      <div className=''>
        <HomeCategoryTable data={home?.grid ?? []} />
      </div>
    </>
  );
};

export default HomeGrid;