import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Container, Skeleton } from '@mui/material';
import ProductCard from '../ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryHeader from '../category/categoryHeader';
import ImageCategorySlider from './ImageCategorySlider';
import { API_FetchCategory } from '../../services/categoryServices';
import { API_FetchProductByIndexPage } from '../../services/productListServices';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';

const ProductByIndexPage = (props) => {
  const theme = useTheme();
  const [categoryLists, setCategoryLists] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categoryImageLists, setCategoryImageLists] = useState({});
  const [loading, setLoading] = useState(true);

  const GetCategoryLists = async () => {
    try {
      const categoryList = await API_FetchCategory();
      setCategoryLists(categoryList);
      return categoryList;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
      return [];
    }
  };

  const GetProductsByCategory = async (categories) => {
    try {
      const products = await API_FetchProductByIndexPage();
      const productsByCategory = categories.reduce((acc, category) => {
        const filteredProducts = products.data1.filter(product => product.CId === category.Id);
        if (filteredProducts.length > 0) {
          acc[category.Id] = filteredProducts;
        }
        return acc;
      }, {});

      const categoryImages = categories.reduce((acc, category) => {
        const filteredImage = products.data.filter(image => image.Id === category.Id);
        if (filteredImage.length > 0) {
          acc[category.Id] = filteredImage;
        }
        return acc;
      }, {});

      setProductsByCategory(productsByCategory);
      setCategoryImageLists(categoryImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await GetCategoryLists();
      GetProductsByCategory(categories);
    };
    fetchData();
  }, []);

  const sliderArrowStyles = {
    arrow: {
      width: '30px',
      height: '30px',
      backgroundColor: theme.palette.basecolorCode.main,
      borderRadius: '50%',
      color: theme.palette.whitecolorCode.main,
      position: 'absolute',
      zIndex: 1,
    },
    prevArrow: {     
      left: '-35px',
    },
    nextArrow: {
      right: '-35px',
    },
  };
  
  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, ...sliderArrowStyles.arrow, ...sliderArrowStyles.prevArrow }}
        onClick={onClick}
      />
    );
  };
  
  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, ...sliderArrowStyles.arrow, ...sliderArrowStyles.nextArrow }}
        onClick={onClick}
      />
    );
  };
  

  const getSliderSettings = (productCount) => {
    return {
      dots: false,
      infinite: productCount > 1, // Disable infinite scrolling if there is only 1 product
      speed: 500,
      slidesToShow: 5, // Show the number of slides based on the product count
      slidesToScroll: 1,
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
      arrows: productCount > 1, // Show arrows only if there's more 
      autoplay: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: Math.min(productCount, 4),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: Math.min(productCount, 3),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            arrows: false,
            slidesToShow: Math.min(productCount, 2),
            slidesToScroll: 1,
          },
        },
      ],
    };
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 1, pb: 1, px: { xs: 0, sm: 0, lg: 3 } }}>
      {loading ? (
        <Skeleton variant="text" height={40} width="30%" />
      ) : (
        categoryLists.map((category) => {
          const products = productsByCategory[category.Id];
          const categoryImages = categoryImageLists[category.Id];

          if (!products || products.length === 0) return null; // Don't render if there are no products

          return (
            <Box key={category.Id} sx={{ marginBottom: 5 }}>
              <CategoryHeader
                CategoryHeading={category.Category}
                categoryId={category.Id}
                categoryValue={category.Id}
              />

              {/* Dynamic slider settings based on product count */}
              <Slider {...getSliderSettings(products.length)}>
                {products.map((product) => (
                  <Box key={product.id} sx={{ padding: 0 }}>
                    <ProductCard get_fav_lists={props.get_fav_lists} product={product} />
                  </Box>
                ))}
              </Slider>

              {/* Render ImageCategorySlider if category images exist */}
              {categoryImages && categoryImages.length > 0 && (
                <Box sx={{ py: 1 }}>
                  <ImageCategorySlider CategoryImageLists={categoryImages} />
                </Box>
              )}
            </Box>
          );
        })
      )}
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    get_fav_lists: state.get_fav_lists, // Get favourite lists from Redux state (Wishlists)
  };
};

export default connect(mapStateToProps, null)(ProductByIndexPage);

