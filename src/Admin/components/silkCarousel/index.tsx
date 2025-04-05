import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SilkCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      <div>
        <h3 className="italic">|</h3>
      </div>
      <div>
        <h3 className="italic">|_|</h3>
      </div>
      <div>
        <h3 className="italic">|_|_|</h3>
      </div>
      <div>
        <h3 className="italic">|_|_|_|</h3>
      </div>
      <div>
        <h3 className="italic">|_|_|_|_|</h3>
      </div>
      <div>
        <h3 className="italic">|_|_|_|_|_|</h3>
      </div>
      <div>
        <h3 className="italic">|_|_|_|_|_|_|</h3>
      </div>
    </Slider>
  );
};

export default SilkCarousel;
