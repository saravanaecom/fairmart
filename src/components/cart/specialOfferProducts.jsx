import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Container, Skeleton } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartProductCard from './cartProductCard';
import { API_FetchOfferFastMovingProduct } from '../../services/productListServices';

const SpecialOfferProduct = () => {
  const [productLists, setProductLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetOfferProductLists = async () => {
      try {
          const objLists = await API_FetchOfferFastMovingProduct();
          setProductLists(objLists);
      } catch (error) {
          console.error("Error fetching categories:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    GetOfferProductLists();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Return null if there are no products or not enough products to display
  if (!loading && (!productLists || productLists.length < 3)) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ margin: 'auto' }}>      
        <Slider {...settings}>
          {loading ? (
            // Render skeleton placeholders for products
            Array.from(new Array(5)).map((_, index) => (
              <Box key={index} sx={{ padding: 1.5 }}>
                <Skeleton variant="rectangular" width={150} height={180} />
                <Skeleton variant="text" height={20} width="80%" sx={{ mt: 2 }} />                
              </Box>
            ))
          ) : (
            productLists.map((product) => (
              <Box key={product.id} sx={{ padding: 2 }}>
                <CartProductCard product={product} />
              </Box>
            ))
          )}
        </Slider>
      </Box>
    </Container>
  );
};

export default SpecialOfferProduct;
