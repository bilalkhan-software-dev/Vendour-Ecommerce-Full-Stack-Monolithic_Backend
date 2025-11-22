import { Button } from "@mui/material"
import CategoryGrid from "./CategoryGrids/CategoryGrid"
import Deal from "./Deal/Deal"
import ElectronicCategory from "./ElectronicCategory/ElectronicCategory"
import ShopByCategory from "./ShopByCategory/ShopByCategory"
import { Storefront } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import becomerSellerBackgroudPic from "../../../assets/pics/ecommerce-2140603_1920-1-1024x438.jpg"

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-8 md:space-y-12 lg:space-y-16 pb-6">
        {/* Electronics Categories */}
        <ElectronicCategory />

        {/* Categories with grid row and col span styling */}
        <CategoryGrid />

        {/* Category with slick <=> (Carousel) */}
        <section className="mt-8 lg:mt-12">
          <h1 className="text-xl lg:text-4xl text-center pb-4 lg:pb-8 font-bold text-primary-color">HOT DEALS</h1>
          <Deal />
        </section>

        {/* Shop by Category */}
        <section className="mt-8 lg:mt-12">
          <h1 className="text-xl lg:text-4xl text-center pb-4 lg:pb-8 font-bold text-primary-color">SHOP BY CATEGORY</h1>
          <ShopByCategory />
        </section>

        {/* Become Seller Section */}
        <section className="px-4 lg:px-20 relative h-[250px] md:h-[350px] lg:h-[450px] w-full overflow-hidden rounded-xl">
          {/* Background image */}
          <img
            src={becomerSellerBackgroudPic}
            alt="Become a seller"
            className="w-full h-full object-cover rounded-2xl brightness-75 hover:brightness-100 transition duration-500"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0  rounded-2xl"></div>

          {/* Text + CTA */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 text-white">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2">
              Sell your products
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-2">With</p>
            <h1 className="text-3xl md:text-4xl lg:text-6xl logo font-bold  mb-4 lg:mb-6">
              Vendor Marketplace
            </h1>

            <Button
              variant="contained"
              onClick={() => navigate("/become-seller")}
              startIcon={<Storefront />}
              size="large"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 1.5,
                px: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.main',
                },
              }}
            >
              Become a Seller
            </Button>
          </div>
        </section>

      </div>
    </>
  )
}

export default Home