import { useAppSelector } from "../../../../redux/store";
import ElectronicCategoryCard from "./ElectronicCategoryCard";

const ElectronicCategory = () => {
  const home = useAppSelector(store => store.home);

  return (
    <div className="grid grid-cols-2 gap-6 py-5 lg:px-20 border-b border-gray-200
      sm:grid-cols-3
      md:grid-cols-6
      ">
      {home.homeData?.electronicCategories.map((electronicCategory) => (
        <ElectronicCategoryCard key={electronicCategory.categoryId} data={electronicCategory} />
      ))}
    </div>
  );
};

export default ElectronicCategory;
