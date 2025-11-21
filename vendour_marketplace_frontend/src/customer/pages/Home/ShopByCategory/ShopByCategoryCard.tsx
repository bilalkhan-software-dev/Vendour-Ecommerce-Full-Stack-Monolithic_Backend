import { useNavigate } from "react-router-dom";
import type { HomeCategoryResponse } from "../../../../types/homeCategory"
import "./shop.css"

interface ShopByCategoryCardProps {
  data: HomeCategoryResponse;
}

const ShopByCategoryCard: React.FC<ShopByCategoryCardProps> = ({ data }) => {

  const navigate = useNavigate();
  return (
    <>
      <div className="flex gap-3 flex-col items-center justify-center group cursor-pointer">

        <div className="custom-border w-[150px] h-[150px] lg:w-[249px] lg:h-[249px] rounded-full"
          onClick={() => navigate(`/products/category/${data.name}/${data.categoryId}`)}
        >
          <img src={data.image}
            alt={data.name}
            className="group-hover:scale-95 rounded-full translate-x object-cover object-top transition-transform duration-300 w-full h-full"
          />
        </div>
        <h1 className="text-md md:text-lg lg:text-2xl font-semibold text-primary-color ">{data.name}</h1>
      </div>
    </>
  )
}

export default ShopByCategoryCard