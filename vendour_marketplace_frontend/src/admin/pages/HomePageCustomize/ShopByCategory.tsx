import { useAppSelector } from '../../../redux/store';
import HomeCategoryTable from './HomeCategoryTable';


export default function ShopByCategory() {

  const home = useAppSelector(store => store.adminHomeCustomization.homePageCategories);


  return (
    <>
      <div className="text-center font-semibold italic md:text-2xl text-primary-color p-4">Shop By Category Customization</div>
      <HomeCategoryTable data={home?.shopByCategory ?? []} />
    </>
  );
}
