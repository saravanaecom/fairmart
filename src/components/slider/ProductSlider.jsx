/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, Container } from '@mui/material';
import ProductCard from '../ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {API_FetchOfferFastMovingProduct} from '../../services/productListServices';

const ProductSlider = ({productLits, categoryLists}) => {
  const [productLists, setproductLists] = useState([]);

  const GetBannerSliderLists = async () => {
      try {
          const objLists = await API_FetchOfferFastMovingProduct();
          setproductLists(objLists);
      } catch (error) {
          console.error("Error fetching categories:", error);
      }
  };

  useEffect(() => {
    GetBannerSliderLists();
  }, []);


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ margin: 'auto' }}>
        <Typography variant="h6" component="div" sx={{ marginBottom: '20px', textAlign: "left" }}>
          Products For You
        </Typography>
        <Slider {...settings}>
          {productLists.map((product) => (
            <Box key={product.id}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default ProductSlider;
