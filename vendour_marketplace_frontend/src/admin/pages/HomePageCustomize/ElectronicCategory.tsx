import { useAppSelector } from "../../../redux/store";
import HomeCategoryTable from "./HomeCategoryTable";


export default function ElectronicCategory() {

  const home = useAppSelector(store => store.adminHomeCustomization.homePageCategories);


  return (
    <>
      <div className="text-center font-semibold italic md:text-2xl text-primary-color p-4">Electronics Category Customization</div>
      <div className="">
        <HomeCategoryTable data={home?.electronicCategories ?? []} />
      </div>
    </>
  );
}
