/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Container, Grid, Typography, FormControl, Select, MenuItem, Button, CircularProgress, Backdrop,Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoImage from '../assets/no-image.png';
import { ServerURL } from '../server/serverUrl';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import { API_FetchProductById } from '../services/productListServices';
import RelatedProducts from '../components/slider/relatedProducts';
import OfferFastMovingProduct from '../components/slider/offerFastMovingProduct';
import BreadCrumbs from '../components/BreadCrumbs';
import { API_InsertMyFavoriteProducts, API_FetchMyFavoriteProducts, API_DeleteMyFavoriteProducts } from '../services/userServices';
import { useCart } from '../context/CartContext';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import * as actionType from '../redux/actionType';
import DOMPurify from "dompurify";


const ProductDetails = (props) => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [productId, setProductId] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productDetails, setProductDetails] = useState({});
    const [imageLists, setImageLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const { cartItems, setCartItems } = useCart();
    const [productValue, setProductValue] = useState(0);
    let [isFavoriteProduct, setIsFavoriteProduct] = useState(0);

    const [productWeight, setProductWeight] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedMRP, setselectedMRP] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);

    const GetProductDetails = async (productId) => {
        try {
            setLoading(true);
            setBackdropOpen(true);
            const fetchedProductDetails = await API_FetchProductById(productId);
            if (Array.isArray(fetchedProductDetails) && fetchedProductDetails.length > 0) {
                const product = fetchedProductDetails[0];
                setProductDetails(product);
                console.log( product)
                setTotalPrice(product.Price);

                // Filter and flatten the image list
                const images = [product.Img0, product.Img1, product.Img2]
                    .filter(img => img && img !== "Undefined.jpg" && img !== "Undefined.png");
                setImageLists(images);

                //Fav product load
                const selectedFavList = props.get_fav_lists.find(item => item.Id === Number(productId));
                if (selectedFavList !== undefined && selectedFavList.length !== 0) {
                    setIsFavoriteProduct(1);
                }
                else {
                    setIsFavoriteProduct(0);
                }

            } else {
                setProductDetails({});
                setImageLists([]);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            setProductDetails({});
            setImageLists([]);
        } finally {
            setLoading(false);
            setBackdropOpen(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodedId = queryParams.get('pdid');
        const productId = encodedId ? decodeURIComponent(encodedId) : null;
        setProductId(atob(productId));
        if (productId) {
            GetProductDetails(atob(productId));           
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, props.get_fav_lists]);

    const handleProductWeightChange = (value, ProductWeightLists, event) => {
        if(event) event.stopPropagation();

        const selectedWeightId = value;
        const selectedWeight = ProductWeightLists.find(item => item?.WeightType === selectedWeightId);
        if (selectedWeight) {
            setProductWeight(selectedWeight.WeightType);
            setTotalPrice(selectedWeight.SaleRate);
            setSelectedPrice(selectedWeight.SaleRate);
            setCurrentPrice(selectedWeight.SaleRate);
            setselectedMRP(selectedWeight.MRP);
        }
    };

    useEffect(() => {
        if (productDetails && productDetails.ProductWeightType && productDetails.ProductWeightType.length > 0) {
            const firstWeight = productDetails.ProductWeightType[0];
            if (firstWeight && firstWeight.WeightType) {
                setProductWeight(firstWeight.WeightType);
                setTotalPrice(firstWeight.SaleRate);
                setSelectedPrice(firstWeight.SaleRate);
                setCurrentPrice(firstWeight.SaleRate);
                setselectedMRP(firstWeight.MRP);
            }
        } else if (productDetails) {
            setProductWeight('');
            setSelectedPrice(productDetails.Price || 0);
            setselectedMRP(productDetails.MRP || 0);
            setTotalPrice(productDetails.Price || 0);
            setCurrentPrice(productDetails.Price || 0);
        }
    }, [productDetails]);


    const hasVariants = productDetails?.MultiplePriceEnable === 1 && productDetails?.ProductWeightType?.length > 0;

    // Check if the product exists in cartItems
    useEffect(() => {
        const existingProduct = cartItems.find(item => {
            const itemId = item?.Productid ? item.Productid : item?.Id;
            const productId = productDetails?.Productid ? productDetails.Productid : productDetails?.Id;
            if (hasVariants) {
                return itemId === productId && item.UnitType === productWeight;
            }
            return itemId === productId;
        });

        if (existingProduct) {
            setQuantity(existingProduct.item);
            setTotalPrice(existingProduct.totalPrice);
            setCurrentPrice(existingProduct.totalPrice);
        } else {
            setQuantity(0);
            setTotalPrice(selectedPrice > 0 ? selectedPrice : productDetails?.Price || 0);
            setCurrentPrice(selectedPrice > 0 ? selectedPrice : productDetails?.Price || 0);
        }
    }, [cartItems, productDetails, selectedPrice, productWeight, hasVariants]);

    // Update cartItems function
    const updateCartItems = (newQuantity, newTotalPrice, MRP, selected_price) => {
        setCartItems(prevCartItems => {
            const updatedCartItems = [...prevCartItems];
            const productId = productDetails?.Productid ? productDetails.Productid : productDetails?.Id;

            const existingProductIndex = updatedCartItems.findIndex(item => {
                const itemId = item?.Productid ? item.Productid : item?.Id;
                if (hasVariants) {
                    return itemId === productId && item.UnitType === productWeight;
                }
                return itemId === productId;
            });

            if (existingProductIndex >= 0) {
                if (newQuantity > 0) {
                    // Update existing product in the cart
                    updatedCartItems[existingProductIndex] = {
                        ...updatedCartItems[existingProductIndex],
                        item: newQuantity,
                        totalPrice: newTotalPrice,
                        totalMRP: MRP,
                        selectedPrice: selected_price,
                        selectedMRP: MRP,
                        UnitType: hasVariants ? productWeight : productDetails?.UnitType
                    };
                } else {
                    // Remove product if the quantity is zero
                    updatedCartItems.splice(existingProductIndex, 1);
                }
            } else if (newQuantity > 0) {
                // Add new product to the cart
                updatedCartItems.push({
                    ...productDetails,
                    item: newQuantity,
                    totalPrice: newTotalPrice,
                    totalMRP: MRP,
                    selectedPrice: selected_price,
                    selectedMRP: MRP,
                    UnitType: hasVariants ? productWeight : productDetails?.UnitType
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });
    };


    // Quantity increment function
    const handleIncrement = (event) => {
        event.stopPropagation();
        const newQuantity = quantity + 1;
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : productDetails.Price);
        const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : productDetails.MRP);

        setQuantity(newQuantity);
        setTotalPrice(newTotalPrice);
        setCurrentPrice(newTotalPrice);
        updateCartItems(newQuantity, newTotalPrice, MRP);
    };

    // Quantity decrement function
    const handleDecrement = (event) => {
        event.stopPropagation();
        const newQuantity = quantity - 1;
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : productDetails.Price);
        const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : productDetails.MRP);

        if (newQuantity === 0) {
            setQuantity(0);
            setTotalPrice(selectedPrice > 0 ? selectedPrice : productDetails.Price);
            updateCartItems(0, selectedPrice > 0 ? selectedPrice : productDetails.Price, MRP);
        } else if (quantity > 0) {
            setQuantity(newQuantity);
            setTotalPrice(newTotalPrice);
            setCurrentPrice(newTotalPrice);
            updateCartItems(newQuantity, newTotalPrice, MRP);
        }
    };

    //Add fav product
  const handleAddFavProduct = async (ProductId, event, status) => {
    event.stopPropagation();
    setIsFavoriteProduct(1);
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      const response = await API_InsertMyFavoriteProducts(ProductId,  Number(atob(userId)));
      if (response.DeleteStatus === 0 && response.ItemmasterRefid !== 0) {
        await FetchMyFavoriteProducts(atob(userId));
        setIsFavoriteProduct(1);
      }
      else{
        setIsFavoriteProduct(0);
      }
    } catch (error) {
      setIsFavoriteProduct(0);
    }
  };

  const FetchMyFavoriteProducts = async (userId) => {
    try {
        const favlist = await API_FetchMyFavoriteProducts(userId);
        if(favlist !== undefined && favlist.length !== 0){
          props.setFavouriteLists(favlist);
        }        
    } catch (error) {
        console.error("Error fetching favorite product lists:", error);
    }
};

  //Remove fav list
  const handleRemoveFavProduct = async (ProductId, event) => {
    event.stopPropagation();
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      const response = await API_DeleteMyFavoriteProducts(ProductId, Number(atob(userId)));
      if (response.DeleteStatus === 1 && response.ItemmasterRefid !== 0) {
        await FetchMyFavoriteProducts(atob(userId));
        setIsFavoriteProduct(0);
      }
    } catch (error) {
      setIsFavoriteProduct(1);
    }
  };
    // Slick Slider settings
    const settings1 = {
        customPaging: function (index) {
            return (
                <img
                    style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                    }}
                    src={
                        imageLists[index] === '/productimages/Undefined.jpg' ||
                        imageLists[index] === '/productimages/Undefined.png' ||
                        imageLists[index] === null ||
                        imageLists[index] === ''
                            ? NoImage
                            : ImagePathRoutes.ProductImagePath + imageLists[index]
                    }
                    alt={
                        imageLists[index] === '/productimages/Undefined.jpg' ||
                        imageLists[index] === '/productimages/Undefined.png' ||
                        'Product name is not available ' + (index + 1)
                    }
                />
            );
        },
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box className="card-wrapper" sx={{ maxWidth: '100%', mx: 'auto', p: 2 }}>
                <Box sx={{ display: 'block', justifyContent: 'space-between' }}>
                    {/* Card Left - Image Slider */}
                    <Box className="product-imgs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>

                    </Box>

                    {/* Card Right - Product Content */}

                </Box>
            </Box>
            <Container maxWidth="lg" sx={{ my: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5}>
                    <Slider {...settings1}>
    {imageLists.map((image, index) => (
        <div key={index}>
            <img
                style={{
                    width: '100%',
                    height: 'auto', // Maintain aspect ratio
                    objectFit: 'contain', // Ensure image is fully visible without distortion
                }}
                src={
                    ImagePathRoutes.ProductImagePath + image === '/productimages/Undefined.jpg' ||
                    ImagePathRoutes.ProductImagePath + image === '/productimages/Undefined.png' ||
                    ImagePathRoutes.ProductImagePath + image === null ||
                    ImagePathRoutes.ProductImagePath + image === ''
                        ? NoImage
                        : ImagePathRoutes.ProductImagePath + image
                }
                alt={productDetails.Description || "Product name is not available " + (index + 1)}
            />
        </div>
    ))}
</Slider>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Box>
                            <Box sx={{ pb: 1 }}><BreadCrumbs CategoryId={productDetails.CId} CategoryName={productDetails.CategoryName} SubCateoryId={productDetails.SId} SubCategoryName={productDetails.SubCategoryName} ProductName={productDetails.Description} /></Box>
                            <Typography component={"h4"} sx={{ fontSize: 20, fontWeight: 600, fontFamily: "inherit", textAlign: "left", pb: 1.5 }}>
                                {productDetails.Description || "Product name is not available"}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '100px', pb: 1 }}>
                            {productDetails.MRP && currentPrice && productDetails.MRP > currentPrice && (
    <Typography sx={{
        position: 'relative',
        left: '8px',
        backgroundColor: '#fff6e0',
        color: '#5d3e03',
        padding: '2px 5px',
        borderRadius: '3px',
        border: '1px solid #90784159',
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        display: 'block'
    }}>
        {Math.round(((productDetails.MRP - currentPrice) / productDetails.MRP) * 100)}% OFF
    </Typography>
)}
                                <Box sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    color: productDetails.isFavorite ? '#3BB77E' : '#3BB77E',
                                }}>
                                    {isFavoriteProduct !== 0 ? <FavoriteIcon size="small" sx={{ color: '#ee4372', fontSize: '18px' }} onClick={(event) => { handleRemoveFavProduct(productDetails?.Productid ? productDetails.Productid : productDetails?.Id, event); }} /> : <FavoriteBorderIcon onClick={(event) => { handleAddFavProduct(productDetails?.Productid ? productDetails.Productid : productDetails?.Id, event, 'Add'); }} size="small" sx={{ color: '#ee4372', fontSize: '18px' }} />}
                                </Box>
                            </Box>
                            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pb: 2 }}>
                                <Typography variant="body2" sx={{ color: '#253D4E', fontSize: '14px', lineHeight: '24px', fontFamily: 'inherit' }}>
                                    {productDetails.MultiplePriceEnable === 0 ? productDetails.UnitType :
                                        <Box sx={{ minWidth: 75, p: 0 }}>
                                            <FormControl fullWidth sx={{ p: 0, border: 'none' }}>
                                                <Select
                                                    sx={{
                                                        height: '30px',
                                                        border: '1px dotted #999',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none',
                                                        },
                                                    }}
                                                    size="small"
                                                    labelId="demo-simple-select-label-multi"
                                                    id="demo-simple-select-multi"
                                                    value={productWeight}
                                                    onChange={(e) => handleProductWeightChange(e, productDetails.ProductWeightType)}
                                                >
                                                    {productDetails.ProductWeightType && productDetails.ProductWeightType.length !== 0 ? (
                                                        productDetails.ProductWeightType.map((weight, index) => (
                                                            <MenuItem sx={{ px: 1, py: 0 }} key={index} name={weight.Id} value={weight.WeightType}>
                                                                {weight.WeightType}
                                                            </MenuItem>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    }
                                </Typography>
                            </Box> */}
                            {/* Variants / Unit */}
                            <Box sx={{ width: '100%', marginBottom: '24px', mt: 2 }}>
                            {productDetails.MultiplePriceEnable === 1 && productDetails.ProductWeightType && productDetails.ProductWeightType.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {productDetails.ProductWeightType.map((weight, index) => (
                                    <Box
                                    key={weight.Id || index}
                                    onClick={(e) => handleProductWeightChange(weight.WeightType, productDetails.ProductWeightType, e)}
                                    sx={{
                                        padding: '8px 16px',
                                        border: productWeight === weight.WeightType ? `2px solid ${theme.palette.basecolorCode.main}` : '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: productWeight === weight.WeightType ? `${theme.palette.basecolorCode.main}15` : '#fff',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        '&:hover': {
                                        borderColor: theme.palette.basecolorCode.main,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                    >
                                    <Typography sx={{ 
                                        fontSize: '14px', 
                                        fontWeight: productWeight === weight.WeightType ? '700' : '500',
                                        color: productWeight === weight.WeightType ? theme.palette.basecolorCode.main : '#444',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {weight.WeightType}
                                    </Typography>
                                    </Box>
                                ))}
                                </Box>
                            ) : (
                                <Typography sx={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                Unit: {productDetails.UnitType}
                                </Typography>
                            )}
                            </Box>

                            <Box sx={{ pb: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'baseline', gap: '16px' }}>
                                <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', fontFamily: 'inherit', textAlign: 'left' }}>
                                    {(currentPrice > 0 ? currentPrice : totalPrice).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </Typography>
                                {productDetails.MRP && ((selectedMRP > 0 ? selectedMRP : productDetails.MRP) > (currentPrice > 0 ? currentPrice : totalPrice)) && (
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: '18px', fontWeight: 400, color: '#999', fontFamily: 'inherit', textAlign: 'left' }}>
                                        {((selectedMRP > 0 ? selectedMRP : productDetails.MRP)).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </Typography>
                                )}
                            </Box>

                            {/* Add / Quantity Button Block */}
                            <Box sx={{ width: { xs: '100%', sm: '60%', md: "40%" }, mt: 2 }}>
                                {productDetails.InStock !== 0 ? (
                                quantity === 0 ? (
                                    <Button
                                    variant="outlined"
                                    onClick={(e) => { handleIncrement(e); }}
                                    sx={{
                                        width: '100%',
                                        height: '48px',
                                        padding: 0,
                                        border: `1px solid ${theme.palette.basecolorCode.main}`,
                                        color: '#fff',
                                        backgroundColor: theme.palette.basecolorCode.main,
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        textTransform: 'none',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 10px ${theme.palette.basecolorCode.main}40`,
                                        '&:hover': {
                                        backgroundColor: theme.palette.basecolorCode.main,
                                        filter: 'brightness(0.9)',
                                        color: '#fff',
                                        border: `1px solid ${theme.palette.basecolorCode.main}`,
                                        transform: 'translateY(-1px)',
                                        boxShadow: `0 6px 14px ${theme.palette.basecolorCode.main}60`,
                                        }
                                    }}
                                    >
                                    ADD TO CART
                                    </Button>
                                ) : (
                                    <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: '48px',
                                    backgroundColor: theme.palette.basecolorCode.main,
                                    borderRadius: '8px',
                                    color: '#fff',
                                    boxShadow: `0 4px 10px ${theme.palette.basecolorCode.main}40`,
                                    }}>
                                    <Typography
                                        onClick={(e) => { handleDecrement(e); }}
                                        sx={{
                                        width: '50px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '8px 0 0 8px' }
                                        }}
                                    >−</Typography>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{quantity}</Typography>
                                    <Typography
                                        onClick={(e) => { handleIncrement(e); }}
                                        sx={{
                                        width: '50px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '0 8px 8px 0' }
                                        }}
                                    >+</Typography>
                                    </Box>
                                )
                                ) : (
                                <Button disabled sx={{
                                    width: '100%', height: '48px', padding: 0, border: '1px solid #ccc', color: '#999', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '15px', fontWeight: '700', textTransform: 'none'
                                }}>
                                    Out of Stock
                                </Button>
                                )}
                            </Box>
                        </Box>

                        <Box>
                        {productDetails.Aproximiatedays ? (
        <Box className="mt-4">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: 'gray',
              textAlign: 'left',
            }}
          >
            Estimated Delivery: 
            <span className="text-blue-600 ml-2">{productDetails.Aproximiatedays}</span>
          </Typography>
        </Box>
      ) : (
        <Box className="mt-4">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: 'gray',
              textAlign: 'left',
            }}
          >
            Estimated Delivery: 
            <span className="text-red-600 ml-2">Not Available</span>
          </Typography>
        </Box>
      )}

                            
                        </Box>


                        <Box className="mt-4">
  {/* Our Choice */}
  {productDetails.OurChoice === 1 && (
    <div 
      style={{ 
        height: '30px',
        width: '100px',
        fontWeight: 'bold', 
        fontSize: '12px', 
        color: 'green', 
        padding: '4px 8px',
        border: '1px solid green',
        borderRadius: '4px',
        backgroundColor: '#f0fff0'
      }}
    >
      Our Choice
    </div>
  )}

  {/* Return Policy */}
  {productDetails.ReturnPolicyDays ? (
    <div 
      style={{ 
        height: '30px',
        width: '200px',
        marginTop: '8px',
        fontWeight: 'bold', 
        fontSize: '12px', 
        color: 'blue',
        padding: '4px 8px',
        border: '1px solid blue',
        borderRadius: '4px',
        backgroundColor: '#f0f8ff'
      }}
    >
      Return available in {productDetails.ReturnPolicyDays}
    </div>
  ) : (
    <div 
      style={{ 
        height: '30px',
        width: '200px',
        marginTop: '8px',
        fontWeight: 'bold', 
        fontSize: '12px', 
        color: 'red',
        padding: '4px 8px',
        border: '1px solid red',
        borderRadius: '4px',
        backgroundColor: '#fff0f0'
      }}
    >
      Return not available
    </div>
  )}
</Box>





                        <Box sx={{ pb: 4, pt: 6.5 }}>
      {/* Title */}
      <Typography sx={{ fontSize: 18, fontWeight: 600, textAlign: "left", pb: 1 }}>
        About Product
      </Typography>

      {/* Product Description */}
      {productDetails.ProductDescription ? (
        <Typography
          component="div"
          sx={{
            textAlign: "left",
            fontSize: 12,
            lineHeight: 1.6,
            fontWeight: 600,
            fontFamily: "'Roboto', sans-serif", // Example font, customize as needed
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(productDetails.ProductDescription),
          }}
        />
      ) : (
        // Fallback Description
        <Typography
          component="p"
          sx={{
            textAlign: "left",
            fontSize: 12,
            lineHeight: 1.6,
            fontFamily: "'Roboto', sans-serif", // Example font, customize as needed
          }}
        >
          High-Quality Materials: Durable build with premium wood, metal, or synthetic materials for long-lasting performance. Superior Sound Output: Engineered for clear, rich, and vibrant tones. Ergonomic Design: Comfortable to use for extended practice or performance sessions. Customizable Settings: Adjustable tuners, frets, or keys for personalized sound. Lightweight and Portable: Easy to carry and ideal for gigs and rehearsals.
        </Typography>
      )}
    </Box>

                    </Grid>
                </Grid>
            </Container>

            {/* Recommendations Section */}
            <Box sx={{ width: '100%', backgroundColor: '#fcfcfc', borderTop: '1px solid #eee', py: 6, mt: 4 }}>
                <Container maxWidth="xl">
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: '40px' }}>
                        {/* Top Products / Offers */}
                        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', p: { xs: 2, md: 4 }, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f5f5f5' }}>
                            <OfferFastMovingProduct />
                        </Box>

                        {/* Similar Category Products */}
                        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', p: { xs: 2, md: 4 }, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f5f5f5' }}>
                            <RelatedProducts ProductId={productId} />
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};


const mapStateToProps = (state) => {
    return { 
      get_fav_lists: state.get_fav_lists, // Get favourite lists from Redux state (Wishlists)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {    
      setFavouriteLists: (data) => dispatch({type: actionType.GET_GLOBAL_FAVOURITE_LISTS, payload: data})
    };
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);