/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Container, Skeleton ,Grid,Typography} from '@mui/material';
import CategoryProductCard from '../categoryprductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryHeader from '../category/categoryHeader';
import ImageCategorySlider from './ImageCategorySlider';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import { padding } from '@mui/system';

const ProductBycategory = (props) => {
  const theme = useTheme();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categoryImageLists, setCategoryImageLists] = useState({});
  const [loading, setLoading] = useState(true);
  
  
  const GetProductsByCategory = async (categories) => {
    try {
      const products = await props.get_product_by_category_index_page;
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
    GetProductsByCategory(props.get_catgory_lists);  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.get_catgory_lists, props.get_product_by_category_index_page]);

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
  

//   const getSliderSettings = (productCount) => {
//     return {
//       dots: false,
//       infinite: productCount > 1, // Disable infinite scrolling if there is only 1 product
//       speed: 500,
//       slidesToShow: 5, // Show the number of slides based on the product count
//       slidesToScroll: 1,
//       prevArrow: <CustomPrevArrow />,
//       nextArrow: <CustomNextArrow />,
//       arrows: productCount > 1, // Show arrows only if there's more 
//       autoplay: false,
//       responsive: [
//         {
//           breakpoint: 1200,
//           settings: {
//             slidesToShow: Math.min(productCount, 4),
//             slidesToScroll: 1,
//           },
//         },
//         {
//           breakpoint: 900,
//           settings: {
//             slidesToShow: Math.min(productCount, 3),
//             slidesToScroll: 1,
//           },
//         },
//         {
//           breakpoint: 600,
//           settings: {
//             arrows: false,
//             slidesToShow: Math.min(productCount, 2),
//             slidesToScroll: 1,
//           },
//         },
//       ],
//     };
//   };

  return (
    <Container maxWidth="xl" sx={{ pt: 1, pb: 1, px: { xs: 0, sm: 0, lg: 3 } }}>
      {props.is_data_loading ? (
        <Skeleton variant="text" height={40} width="30%" />
      ) : (
            <Box  sx={{ marginBottom: 5 }}>

<Typography
  variant="h1"
  sx={{
    fontSize: { xs: '12px', sm: '12px', md:'12px', lg:'30px', xl: '14px' },
    fontWeight: 'bold',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    fontFamily: 'inherit',
    height: { xs: '23px', sm: '25px', md: '452px', lg: '45px', xl: '32px' },
    color: theme.palette.lightblackcolorCode.main,
    paddingBottom:'120px',
    paddingTop:'30px',
    marginBottom: '0px',
    textAlign: 'left',
    marginLeft: '0',  
  }}
>
  Categories
</Typography>

              {/* <CategoryHeader
                CategoryHeading={category.Category}
                categoryId={category.Id}
                categoryValue={category.Id}
              /> */}

              {/* Dynamic slider settings based on product count */}
              {/* <Slider {...getSliderSettings(products.length)}>
                {products.map((product) => (
                  <Box key={product.id} sx={{ padding: 0 }}>
                    <CategoryProductCard get_fav_lists={props.get_fav_lists} product={product} />
                  </Box>
                ))}
              </Slider> */}
                  <Grid container spacing={2}>
                    
      {props.get_catgory_lists.slice(0,8).map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Box sx={{ padding: 0 }}>
            
            <CategoryProductCard  product={product} />
          </Box>
        </Grid>
      ))}
    </Grid>

              
              {/* {categoryImages && categoryImages.length > 0 && (
                <Box sx={{ py: 1 }}>
                  <ImageCategorySlider CategoryImageLists={categoryImages} />
                </Box>
              )} */}
            </Box>
         
      )}
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    is_data_loading: state.is_data_loading,
    get_catgory_lists: state.get_catgory_lists,
    get_product_by_category_index_page: state.get_product_by_category_index_page,
    get_fav_lists: state.get_fav_lists,
  };
};

export default connect(mapStateToProps, null)(ProductBycategory);

