import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/store";
const CategoryGrid = () => {


    const home = useAppSelector(store => store.home);
    const navigate = useNavigate();

    const grid = home.homeData?.grid ?? [];

    const [grid0, grid1, grid2, grid3, grid4, grid5] = grid



    return (
        <div>
            <div className="grid grid-cols-12 grid-rows-12 gap-4 
        lg:h-[600px] px-5 lg:px-20">

                <div className="col-span-3 row-span-12 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid0?.image}
                        alt={grid0?.name}
                        onClick={() => navigate(`/products/category/${grid0.image}/${grid0.categoryId}`)}
                        className="w-full h-full object-cover object-top rounded-md"
                    />
                </div>

                <div className="col-span-2 row-span-6 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid1?.image}
                        alt={grid1?.name}
                        onClick={() => navigate(`/products/category/${grid1?.name}/${grid1?.categoryId}`)}
                        className="w-full h-full object-cover object-top rounded-md"
                    />
                </div>

                <div className="col-span-4 row-span-6 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid2?.image}
                        alt={grid2?.name} className="w-full h-full object-cover object-center rounded-md"
                        onClick={() => navigate(`/products/category/${grid2?.name}/${grid2?.categoryId}`)}
                    />
                </div>

                <div className="col-span-3 row-span-12 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid3?.image}
                        alt={grid3?.name}
                        onClick={() => navigate(`/products/category/${grid3?.name}/${grid3?.categoryId}`)}
                        className="w-full h-full object-cover object-center rounded-md"
                    />
                </div>

                <div className="col-span-4 row-span-6 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid4?.image}
                        alt={grid4?.name}
                        onClick={() => navigate(`/products/category/${grid4?.name}/${grid4?.categoryId}`)}
                        className="w-full h-full object-cover object-center rounded-md"
                    />
                </div>

                <div className="col-span-2 row-span-6 text-white 
                hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
                    <img src={grid5?.image}
                        alt={grid5?.name} className="w-full h-full object-cover object-center rounded-md"
                        onClick={() => navigate(`/products/category/${grid5?.name}/${grid5?.categoryId}`)}
                    />
                </div>
            </div>
        </div>
    )
}

export default CategoryGrid