/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CardMedia, Skeleton, MenuItem, FormControl, Select } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import { ServerURL } from '../server/serverUrl';
import { API_InsertMyFavoriteProducts, API_DeleteMyFavoriteProducts, API_FetchMyFavoriteProducts } from '../services/userServices';
import { useCart } from '../context/CartContext';
import { useTheme } from '@mui/material/styles';
import * as actionType from '../redux/actionType';
import { connect } from 'react-redux';
import AppLogin from '../components/authentication/AppLogin';
import AppRegister from '../components/authentication/AppRegister';
import AppForgetPassword from '../components/authentication/AppForgetPassword';

const CategoryProductCard = ({ get_fav_lists, product, isLoading, offerProducts, relatedProducts, newProducts }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems, setCartItems } = useCart();
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [forgetPasswordDrawerOpen, setForgetPasswordDrawerOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(product?.Price || 0);
  const [productId, setProductId] = useState(0);
  const [productValue, setProductValue] = useState(0);
  let [isFavoriteProduct, setIsFavoriteProduct] = useState(0);

  const [productWeight, setProductWeight] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedMRP, setselectedMRP] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [favProductLists, setFavProductLists] = useState([]);

  //Fav product lists
  const FetchMyFavoriteProducts = async (ProductId) => {
    if (get_fav_lists.length !== 0) {
      setFavProductLists(get_fav_lists);
      const productId = ProductId !== 0 ? ProductId : product?.Productid ? product.Productid : product?.Id;
      const selectedFavList = get_fav_lists.find(item => item.Id === productId);
      if (selectedFavList !== undefined && selectedFavList.length !== 0) {
        setIsFavoriteProduct(1);
      }
      else {
        setIsFavoriteProduct(0);
      }
    }
  };

  useEffect(() => {
    FetchMyFavoriteProducts(product?.Productid ? product.Productid : product?.Id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleProductWeightChange = (event, ProductWeightLists) => {
    event.stopPropagation();

    const selectedWeightId = event.target.value;
    const selectedWeight = ProductWeightLists.find(item => item?.WeightType === selectedWeightId);
    if (selectedWeight) {
      setProductWeight(selectedWeight.WeightType);
      setTotalPrice(selectedWeight.SaleRate);
      setSelectedPrice(selectedWeight.SaleRate);
      setCurrentPrice(selectedWeight.SaleRate);
      setselectedMRP(selectedWeight.MRP);

      const newTotalPrice = quantity * (selectedWeight.SaleRate);
      const newMRP = quantity * (selectedWeight.MRP);
      updateCartItems(quantity, newTotalPrice, newMRP, selectedWeight.SaleRate);
    }
  };

  useEffect(() => {
    if (product && product.ProductWeightType && product.ProductWeightType.length > 0) {
      const firstWeight = product.ProductWeightType[0];
      if (firstWeight && firstWeight.WeightType) {
        setProductWeight(firstWeight.WeightType);
      }
    }
  }, [product]);


  // Check if the product exists in cartItems
  useEffect(() => {
    const existingProduct = cartItems.find(item => {
      const itemId = item?.Productid ? item.Productid : item?.Id;
      const productId = product?.Productid ? product.Productid : product?.Id;
      return itemId === productId;
    });

    if (existingProduct) {
      setQuantity(existingProduct.item);
      setTotalPrice(existingProduct.totalPrice);
      setCurrentPrice(existingProduct.totalPrice);
    } else {
      setQuantity(0);
      setTotalPrice(product?.Price || 0);
      setCurrentPrice(selectedPrice > 0 ? selectedPrice : product?.Price || 0);
    }
  }, [cartItems, product, selectedPrice]);

  // Update cartItems function
  const updateCartItems = (newQuantity, newTotalPrice, MRP, selected_price) => {
    setCartItems(prevCartItems => {
      const updatedCartItems = [...prevCartItems];
      const productId = product?.Productid ? product.Productid : product?.Id;

      const existingProductIndex = updatedCartItems.findIndex(item => {
        const itemId = item?.Productid ? item.Productid : item?.Id;
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
            selectedMRP: MRP
          };
        } else {
          // Remove product if the quantity is zero
          updatedCartItems.splice(existingProductIndex, 1);
        }
      } else if (newQuantity > 0) {
        // Add new product to the cart
        updatedCartItems.push({
          ...product,
          item: newQuantity,
          totalPrice: newTotalPrice,
          totalMRP: MRP,
          selectedPrice: selected_price,
          selectedMRP: MRP
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
    const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : product.Price);
    const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : product.MRP);

    setQuantity(newQuantity);
    setTotalPrice(newTotalPrice);
    setCurrentPrice(newTotalPrice);
    updateCartItems(newQuantity, newTotalPrice, MRP);
  };

  // Quantity decrement function
  const handleDecrement = (event) => {
    event.stopPropagation();
    const newQuantity = quantity - 1;
    const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : product.Price);
    const MRP = newQuantity * (selectedMRP > 0 ? selectedMRP : product.MRP);

    if (newQuantity === 0) {
      setQuantity(0);
      setTotalPrice(selectedPrice > 0 ? selectedPrice : product.Price);
      updateCartItems(0, selectedPrice > 0 ? selectedPrice : product.Price, MRP);
    } else if (quantity > 0) {
      setQuantity(newQuantity);
      setTotalPrice(newTotalPrice);
      setCurrentPrice(newTotalPrice);
      updateCartItems(newQuantity, newTotalPrice, MRP);
    }
  };

  //View product description page
  const handleProductClick = (event) => {
    const pdId = event.currentTarget.id;
    const pdValue = event.currentTarget.getAttribute('name');
    setProductId(pdId);
    setProductValue(pdValue);
    navigate(`/product-details?pdid=${encodeURIComponent(btoa(pdId))}&pdname=${encodeURIComponent(btoa(pdId))}`);
    window.scrollTo(0, 0);
  };

  //Add fav product
  const handleAddFavProduct = async (ProductId, event, status) => {
    event.stopPropagation();
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      if(userId){
        const response = await API_InsertMyFavoriteProducts(ProductId,  Number(atob(userId)));
        if (response.DeleteStatus === 0 && response.ItemmasterRefid !== 0) {
          await FetchMyFavoriteProducts(ProductId);
          setIsFavoriteProduct(1);
        }
        else{
          setIsFavoriteProduct(0);
        }
      }
      else{
        setIsFavoriteProduct(0);
        setLoginDrawerOpen(true);
      }
    } catch (error) {
      setIsFavoriteProduct(0);
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
        //await FetchMyFavoriteProducts(atob(userId));
        setIsFavoriteProduct(0);
      }
    } catch (error) {
      setIsFavoriteProduct(1);
    }
  };

  const handleAuthDrawerToggle = (event) => {
    if (event === false) {      
      if (loginDrawerOpen === true) {        
        setLoginDrawerOpen((prev) => !prev);
      }
      else if (forgetPasswordDrawerOpen === true) {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setForgetPasswordDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
    else {
      const id = event.currentTarget.id;
      if (id === "register_btn") {
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setRegisterDrawerOpen((prev) => !prev);
      }
      else if (id === "login_btn") {
        setRegisterDrawerOpen(false);
        setCartDrawerOpen(false);
        setLoginDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
  };

  return (
    <>
    <Card
      id={product?.Productid ? product.Productid : product?.Id}
      name={product.Description}
      value={product?.Productid ? product.Productid : product?.Id}
      sx={{
        width: { xs: offerProducts === null && relatedProducts === null && newProducts === null ? 155 : 175, sm: 220, md: 260, lg: 320 },
        height: { xs: 320, sm: 380, md: 350, lg: 300 },
        margin: '0 auto',
        textAlign: 'left',
        border: '1px solid #e8e8e8',
        borderRadius:'30px',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 7px 0 rgb(218 220 230 / 60%)',
        },
        '&:hover .card-media': {
          transform: 'scale(1.1)',
        },
      }}
    >
      {isLoading ? (
        // Render skeleton placeholders for products
        Array.from(new Array(5)).map((_, index) => (
          <Box key={index} sx={{ padding: 2 }}>
            <Skeleton variant="rectangular" width={250} height={250} />
            <Skeleton variant="text" height={20} width="80%" sx={{ mt: 2 }} />
            <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" height={40} width="100%" sx={{ mt: 2 }} />
          </Box>
        ))
      ) : (
        <Box sx={{ position: 'relative', height: { xs: '50%', sm: '55%', md: '100%' },width:'100%' }}>
          <CardMedia
            id={product?.Productid ? product.Productid : product?.Id}
            name={product.Description}
            value={product?.Productid ? product.Productid : product?.Id}
            component="img"
            onClick={handleProductClick}
            image={newProducts === 'new_product' ? ImagePathRoutes.CategoryImagePath + product.ImagePath : ImagePathRoutes.CategoryImagePath + product.ImagePath}
            alt={product.Description}
            className="card-media"
            sx={{
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              width: '100%',
              height: '100%',
              padding: { xs: '10px', sm: '12px', md: '15px' },
              objectFit: 'contain',
            }}
          />
          {/* {Math.round(product.Offer) !== 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: '#fff6e0',
                color: '#5d3e03',
                padding: '2px 5px',
                borderRadius: '3px',
                border: '1px solid #90784159',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
              }}
            >
              {Math.round(product.Offer)}% OFF
            </Box>
          )} */}
          {/* <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: product.isFavorite !== 0 ? theme.palette.basecolorCode.main : theme.palette.whitecolorCode.main,
            }}
            id={product.isFavorite !== null ? product.isFavorite : isFavoriteProduct}
          >
            {isFavoriteProduct !== 0 ? <FavoriteIcon size="small" sx={{ color: '#ee4372', fontSize: '18px' }} onClick={(event) => { handleRemoveFavProduct(product?.Productid ? product.Productid : product?.Id, event); }} /> : <FavoriteBorderIcon onClick={(event) => { handleAddFavProduct(product?.Productid ? product.Productid : product?.Id, event, 'Add'); }} size="small" sx={{ color: '#ee4372', fontSize: '18px' }} />}
          </Box> */}
        </Box>
      )}
    
    </Card>
    <CardContent sx={{ height: { xs: '50%', sm: '45%', md: '40%' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" width="100%" height={20} />
          </>
        ) : (
          <>
            <Box sx={{ flex: '1 0 auto' }}>
              <Typography
                variant="body2"
                component={"p"}
                id={product?.Productid ? product.Productid : product?.Id}
                name={product.Description}
                value={product?.Productid ? product.Productid : product?.Id}
                onClick={handleProductClick}
                sx={{
                  fontSize: { xs: '12px', sm: '12px', md: '12px', lg: '14px', xl: '14px' },
                  width:{xs:'130px',md:'170px',lg:'170px'},
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  position:'relative',
                  left:{xs:'100px',md:'60px',lg:'60px'},
                  bottom:{xs:'70px',md:'60px',lg:'60px'},
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  lineHeight: '15px',
                  fontFamily: 'inherit',
                  minHeight: { xs: '23px', sm: '25px', md: '28px', lg: '32px', xl: '32px' },
                  color: theme.palette.lightblackcolorCode.main,
                  backgroundColor: '#ffffff',  
                  borderRadius: '10px',
                  padding: '8px 16px',
                  border: '1px solid green',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {product.Category}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
                {product.quantity}
              </Typography> */}
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.lightblackcolorCode.main, fontSize: '14px', lineHeight: '24px', fontFamily: 'inherit' }}
              >
                {product.MultiplePriceEnable === 0 ? product.UnitType :
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
                        onChange={(e) => handleProductWeightChange(e, product.ProductWeightType)}
                      >
                        {product.ProductWeightType.map((weight, index) => (
                          <MenuItem sx={{ px: 1, py: 0 }} key={index} name={weight.Id} value={weight.WeightType}>
                            {weight.WeightType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                }
              </Typography>
            </Box> */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.lightblackcolorCode.main, fontSize: '16px', lineHeight: '24px', fontFamily: 'inherit' }}
              >
                {(currentPrice > 0 ? currentPrice : totalPrice).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              {product.MRP && (
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', fontSize: '14px', fontWeight: 200, color: '#a3a4ae', fontFamily: 'inherit' }}
                >
                  {'MRP:' + ((selectedMRP > 0 ? selectedMRP : product.MRP)).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              )}
            </Box> */}
            {/* <Button
              variant="outlined"
              sx={{
                width: "100%",
                display: quantity !== 0 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '10px',
                border: '1px solid',
                borderColor: theme.palette.basecolorCode.main,
                fontFamily: 'inherit',
                padding: { xs: '6px 0px', sm: '7px 0px', md: '7.2px 0px' },
                '&:hover': {
                  background: 'none',
                  border: '1px solid',
                  borderColor: theme.palette.basecolorCode.main,
                  color: theme.palette.basecolorCode.main
                }
              }}
            >
              <Typography
                variant="body2"
                onClick={(e) => { handleDecrement(e); }}
                disabled={quantity === 0}
                sx={{
                  width: '25%',
                  color: theme.palette.basecolorCode.main,
                  fontFamily: 'inherit',
                }}
              >
                -
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  width: '50%',
                  color: theme.palette.basecolorCode.main,
                  fontFamily: 'inherit',
                }}
              >
                {quantity}
              </Typography>
              <Typography
                variant="body2"
                id={product?.Productid ? product.Productid : product?.Id}
                name={product.Description}
                value={product?.Productid ? product.Productid : product?.Id}
                onClick={(e) => { handleIncrement(e); }}
                sx={{
                  width: '25%',
                  color: theme.palette.basecolorCode.main,
                  fontFamily: 'inherit',
                }}
              >
                +
              </Typography>
            </Button> */}
            {/* {product.InStock !== 0 ?
              // <Button
              //   variant="outlined"
              //   sx={{
              //     display: quantity !== 0 ? 'none' : 'block',
              //     marginTop: '10px',
              //     width: '100%',
              //     textTransform: 'none',
              //     fontFamily: 'inherit',
              //     fontWeight: 600,
              //     border: '1px solid',
              //     borderColor: theme.palette.basecolorCode.main,
              //     backgroundColor: theme.palette.shadowcolorCode.main,
              //     color: theme.palette.basecolorCode.main,
              //     '&:hover': {
              //       background: 'none',
              //       border: '1px solid',
              //       borderColor: theme.palette.basecolorCode.main,
              //       color: theme.palette.basecolorCode.main,
              //     }
              //   }}
              //   id={product.Id}
              //   onClick={(e) => { handleIncrement(e); }}
              // >
              //   Add to Cart
              // </Button>
              // :
              // <Button
              //   variant="outlined"
              //   sx={{
              //     marginTop: '10px',
              //     width: '100%',
              //     textTransform: 'none',
              //     fontFamily: 'inherit',
              //     border: '1px solid #dc3545',
              //     backgroundColor: '#dc3545',
              //     color: theme.palette.whitecolorCode.main,
              //     '&:hover': {
              //       border: '1px solid #dc3545',
              //       backgroundColor: '#dc3545',
              //       color: theme.palette.whitecolorCode.main,
              //     }
              //   }}
              //   id={product.Id}
              // >
              //   Out of Stock
              // </Button>
            } */}
          </>
        )}
      </CardContent>
    <AppRegister RegisterDrawerOpen={registerDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
    <AppLogin LoginDrawerOpen={loginDrawerOpen} setRegisterDrawerOpen={setRegisterDrawerOpen} setForgetPasswordDrawerOpen={setForgetPasswordDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
    <AppForgetPassword ForgetPasswordDrawerOpen={forgetPasswordDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
    </>    
  );
};

const mapStateToProps = (state) => {
  return {
    is_data_loading: state.is_data_loading,
    get_fav_lists: state.get_fav_lists,
  };
};

export default connect(mapStateToProps, null)(CategoryProductCard);
