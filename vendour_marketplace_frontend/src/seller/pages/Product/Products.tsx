import { useAppSelector } from "../../../redux/store";
import ProductTable from "./ProductTable";

const Products = () => {

  const product = useAppSelector(store => store.sellerProduct);
  return (
    <>
      <div className=''>
        <h1 className="font-bold text-xl mb-5">Total Products: <span className="text-primary-color text-2xl">{product.products?.length}</span> </h1>
        <ProductTable />
      </div>
    </>
  );
};

export default Products;