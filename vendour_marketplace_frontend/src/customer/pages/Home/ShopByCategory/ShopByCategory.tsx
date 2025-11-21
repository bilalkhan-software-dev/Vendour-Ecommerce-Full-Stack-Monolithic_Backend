import Slider from "react-slick";
import ShopByCategoryCard from "./ShopByCategoryCard";
import { useAppSelector } from "../../../../redux/store";



const ShopByCategory = () => {
  const settings = {
    dots: true,          //  Show navigation dots under the slider
    infinite: true,      //  Loop infinitely (after last slide → goes back to first)
    slidesToShow: 4,     //  Number of slides visible at once
    slidesToScroll: 1,   //  Number of slides moved per scroll/auto-slide
    autoplay: true,      //  Auto-play slides without user interaction
    speed: 2000,         //  Animation duration (ms) → takes 5s to slide
    autoplaySpeed: 0,    //  Delay between slides → 0 means "no pause"
    cssEase: "linear",   //  Easing function: linear = constant speed (good for ticker/marquee style)
    rtl: true,
    responsive: [        //  Breakpoints for responsiveness
      {
        breakpoint: 1024,            // screen ≤ 1024px
        settings: { slidesToShow: 3 } // show 2 slides
      },
      {
        breakpoint: 640,             // screen ≤ 640px
        settings: { slidesToShow: 2 } // show 1 slide
      },
    ],
  };
  const home = useAppSelector(store => store.home);


  return (
    <div className="px-6 lg:px-20 relative border-b border-gray-200/100 py-12">
      <Slider {...settings}>
        {home.homeData?.shopByCategory.map((item) => (
          <div key={item.id} className="px-6">
            <ShopByCategoryCard data={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ShopByCategory;
