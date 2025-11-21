import DealCard from "./DealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useAppSelector } from "../../../../redux/store";

const Deal = () => {
    const settings = {
        dots: true,          //  Show navigation dots under the slider
        infinite: true,      //  Loop infinitely (after last slide → goes back to first)
        slidesToShow: 3,     //  Number of slides visible at once
        slidesToScroll: 1,   //  Number of slides moved per scroll/auto-slide
        autoplay: true,      //  Auto-play slides without user interaction
        speed: 4000,         //  Animation duration (ms) → takes 5s to slide
        autoplaySpeed: 0,    //  Delay between slides → 0 means "no pause"
        cssEase: "linear",   //  Easing function: linear = constant speed (good for ticker/marquee style)
        responsive: [        //  Breakpoints for responsiveness
            {
                breakpoint: 1024,            // screen ≤ 1024px
                settings: { slidesToShow: 2 } // show 2 slides
            },
            {
                breakpoint: 640,             // screen ≤ 640px
                settings: { slidesToShow: 1 } // show 1 slide
            },
        ],
    };
    const home = useAppSelector(store => store.home);


    return (
        <div className="relative py-12 md:py-7 lg:px-20 border-b border-gray-200/100 ">
            <Slider {...settings}>
                {home.homeData?.deals.map((deal) => (
                    <DealCard
                        key={deal.id}
                        title={deal.homeCategory.name ?? "Unknown"}
                        image={deal.homeCategory.image}
                        discountPercent={deal.discount}
                        categoryId={deal.homeCategory.categoryId ?? "Unknown"}
                    />
                ))}
            </Slider>
        </div>
    );
};

export default Deal;
