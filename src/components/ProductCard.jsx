/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
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
import { motion } from 'framer-motion';
import Productimg from '../assets/no-image.png';

const ProductCard = ({ get_fav_lists, product, isLoading, offerProducts, relatedProducts, newProducts }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems, setCartItems } = useCart();
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

  const productWeightOptions = useMemo(
    () => (Array.isArray(product?.ProductWeightType) ? product.ProductWeightType : []),
    [product?.ProductWeightType]
  );

  const hasVariants = product?.MultiplePriceEnable === 1 && productWeightOptions.length > 0;
  const selectedVariant = hasVariants
    ? productWeightOptions.find((variant) => variant?.WeightType === productWeight) || productWeightOptions[0]
    : null;
  const effectiveSaleRate = selectedVariant?.SaleRate ?? product?.Price ?? 0;
  const effectiveMRPValue = selectedVariant?.MRP ?? product?.MRP ?? 0;
  const unitText = hasVariants ? selectedVariant?.WeightType ?? product?.UnitType : product?.UnitType || 'Qty';

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



  const handleProductWeightChange = (eventOrValue) => {
    const selectedWeightId = typeof eventOrValue === 'string'
      ? eventOrValue
      : eventOrValue?.target?.value;

    if (eventOrValue?.stopPropagation) {
      eventOrValue.stopPropagation();
    }

    const selectedWeight = productWeightOptions.find(item => item?.WeightType === selectedWeightId);

    if (selectedWeight) {
      setProductWeight(selectedWeight.WeightType);
      setSelectedPrice(selectedWeight.SaleRate);
      setselectedMRP(selectedWeight.MRP);
      setQuantity(0);
      setTotalPrice(selectedWeight.SaleRate);
      setCurrentPrice(selectedWeight.SaleRate);
    }
  };

  useEffect(() => {
    if (productWeightOptions.length > 0 && productWeightOptions[0]) {
      const firstWeight = productWeightOptions[0];
      setProductWeight(firstWeight?.WeightType || '');
      setSelectedPrice(firstWeight?.SaleRate || 0);
      setselectedMRP(firstWeight?.MRP || 0);
      setTotalPrice(firstWeight?.SaleRate || 0);
      setCurrentPrice(firstWeight?.SaleRate || 0);
    } else {
      setProductWeight('');
      setSelectedPrice(product?.Price ?? 0);
      setselectedMRP(product?.MRP ?? 0);
      setTotalPrice(product?.Price ?? 0);
      setCurrentPrice(product?.Price ?? 0);
    }
  }, [productWeightOptions, product]);


  // Check if the product exists in cartItems
  useEffect(() => {
    const existingProduct = cartItems.find(item => {
      const itemId = item?.Productid ? item.Productid : item?.Id;
      const productId = product?.Productid ? product.Productid : product?.Id;
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
      setTotalPrice(selectedPrice > 0 ? selectedPrice : product?.Price || 0);
      setCurrentPrice(selectedPrice > 0 ? selectedPrice : product?.Price || 0);
    }
  }, [cartItems, product, selectedPrice, productWeight, hasVariants]);

  // Update cartItems function
  const updateCartItems = (newQuantity, newTotalPrice, MRP, selected_price) => {
    setCartItems(prevCartItems => {
      const updatedCartItems = [...prevCartItems];
      const productId = product?.Productid ? product.Productid : product?.Id;

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
            UnitType: hasVariants ? productWeight : product?.UnitType
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
          selectedMRP: MRP,
          UnitType: hasVariants ? productWeight : product?.UnitType
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };


  // Quantity increment function
  const handleIncrement = (event) => {
    event.stopPropagation();
    const unitPrice = selectedPrice > 0 ? selectedPrice : effectiveSaleRate;
    const unitMRP = selectedMRP > 0 ? selectedMRP : effectiveMRPValue;
    const newQuantity = quantity + 1;
    const newTotalPrice = newQuantity * unitPrice;
    const newTotalMRP = newQuantity * unitMRP;

    setQuantity(newQuantity);
    setTotalPrice(newTotalPrice);
    setCurrentPrice(newTotalPrice);
    updateCartItems(newQuantity, newTotalPrice, newTotalMRP, unitPrice);
  };

  // Quantity decrement function
  const handleDecrement = (event) => {
    event.stopPropagation();
    const unitPrice = selectedPrice > 0 ? selectedPrice : effectiveSaleRate;
    const unitMRP = selectedMRP > 0 ? selectedMRP : effectiveMRPValue;
    const newQuantity = quantity - 1;
    const newTotalPrice = newQuantity * unitPrice;
    const newTotalMRP = Math.max(0, newQuantity * unitMRP);

    if (newQuantity <= 0) {
      setQuantity(0);
      setTotalPrice(unitPrice);
      setCurrentPrice(unitPrice);
      updateCartItems(0, unitPrice, 0, unitPrice);
    } else {
      setQuantity(newQuantity);
      setTotalPrice(newTotalPrice);
      setCurrentPrice(newTotalPrice);
      updateCartItems(newQuantity, newTotalPrice, newTotalMRP, unitPrice);
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
    setIsFavoriteProduct(1);
    let userId = localStorage.getItem("userId");
    userId = userId ? decodeURIComponent(userId) : null;
    try {
      const response = await API_InsertMyFavoriteProducts(ProductId,  Number(atob(userId)));
      if (response.DeleteStatus === 0 && response.ItemmasterRefid !== 0) {
        await FetchMyFavoriteProducts(ProductId);
        setIsFavoriteProduct(1);
      }
      else{
        setIsFavoriteProduct(0);
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

  return (
 
    <Card
      id={product?.Productid ? product.Productid : product?.Id}
      name={product.Description}
      value={product?.Productid ? product.Productid : product?.Id}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: 320, sm: 350, md: 370 },
        margin: '0 auto',
        textAlign: 'left',
        background: '#ffffff', // Clean solid white
        border: '1px solid #f0f0f0',
        borderRadius: '16px',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-3px)',
          borderColor: '#e8e8e8',
          '& .card-media': {
            transform: 'scale(1.05)',
          }
        }
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
        <Box sx={{ position: 'relative', height: '140px', width: '100%', backgroundColor: '#fcfcfc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <CardMedia
            id={product?.Productid ? product.Productid : product?.Id}
            name={product.Description}
            value={product?.Productid ? product.Productid : product?.Id}
            component="img"
            onClick={handleProductClick}
            image={newProducts === 'new_product' ? ImagePathRoutes.ProductDetailsImagePath + product.Img0 : ImagePathRoutes.ProductImagePath + product.Img0}
            alt={product.Description}
            className="card-media"
            sx={{
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />

          {Math.round(product.Offer) !== 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(255, 107, 107, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 107, 107, 0.18)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 2
              }}
            >

                <span style={{ fontSize: '14px' }}>{Math.round(product.Offer)}%</span>
                  <span style={{ fontSize: '11px' }}>OFF</span>
            </Box>
          )}
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              zIndex: 2,
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'rgba(255, 255, 255, 0.35)',
              }
            }}
            id={product.isFavorite !== null ? product.isFavorite : isFavoriteProduct}
          >
            {isFavoriteProduct !== 0 ? <FavoriteIcon size="small"   sx={{ 
                      color: '#ee4372',
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 2px rgba(238, 67, 114, 0.2))'
                    }} 
                    onClick={(event) => { handleRemoveFavProduct(product?.Productid ? product.Productid : product?.Id, event); }} /> : <FavoriteBorderIcon onClick={(event) => { handleAddFavProduct(product?.Productid ? product.Productid : product?.Id, event, 'Add'); }} size="small" sx={{ color: '#ee4372', fontSize: '18px' }} />}
          </Box>
 
        </Box>
      )}
 
      <CardContent 
       sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        background: '#ffffff',
        zIndex: 2,
        '&:last-child': { paddingBottom: '12px' }
      }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" width="100%" height={20} />
          </>
        ) : (
          <>

{product.OurChoice === 1 && (
  <Box
    sx={{
      position: 'absolute',
      bottom:'150px',
      right: '8px',
      backgroundColor: '#ee4372',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 'bold',
      borderRadius: '4px',
      padding: '4px 8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
    }}
  >
    Our Choice
  </Box>
)}
            <Box sx={{ flex: '1 0 auto' }}>
              <Typography
                variant="body2"
                component={"p"}
                id={product?.Productid ? product.Productid : product?.Id}
                name={product.Description}
                value={product?.Productid ? product.Productid : product?.Id}
                onClick={handleProductClick}
                sx={{
                  fontSize: { xs: '13px', sm: '14px', md: '15px' },
                  fontWeight: '600',
                  height: '40px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.4',
                  marginBottom: '8px',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#0984e3',
                  },
                  color: theme.palette.lightblackcolorCode.main
                }}
              >
                {product.Description}
              </Typography>
               

              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
                {product.quantity}
              </Typography>
            </Box>
    

   



            {/* Variants / Unit */}
            <Box sx={{ width: '100%', marginBottom: '10px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', mb: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#444', fontWeight: 600 }}>
                  {unitText}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: product.InStock !== 0 ? '#2e7d32' : '#d32f2f', fontWeight: 700 }}>
                  {product.InStock !== 0 ? 'In stock' : 'Out of stock'}
                </Typography>
              </Box>

              {product.MultiplePriceEnable === 1 && product.ProductWeightType && product.ProductWeightType.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {product.ProductWeightType.map((weight, index) => (
                    <Box
                      key={weight.Id || index}
                      onClick={() => handleProductWeightChange(weight.WeightType)}
                      sx={{
                        padding: '8px 12px',
                        border: productWeight === weight.WeightType ? `1px solid ${theme.palette.basecolorCode.main}` : '1px solid #e0e0e0',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        backgroundColor: productWeight === weight.WeightType ? `${theme.palette.basecolorCode.main}15` : '#fff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.palette.basecolorCode.main,
                          backgroundColor: '#f4fbff',
                        }
                      }}
                    >
                      <Typography sx={{
                        fontSize: '12px',
                        fontWeight: productWeight === weight.WeightType ? 700 : 500,
                        color: productWeight === weight.WeightType ? theme.palette.basecolorCode.main : '#333',
                        whiteSpace: 'nowrap'
                      }}>
                        {weight.WeightType}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                  {product.UnitType}
                </Typography>
              )}
            </Box>

            {/* Price and Add to Cart Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '10px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px', p: '12px', background: 'rgba(214, 40, 40, 0.06)', borderRadius: '16px', border: '1px solid rgba(214, 40, 40, 0.18)' }}>
                <Box>
                  <Typography sx={{ fontSize: '11px', color: '#b33030', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Price
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#d62828' }}>
                    ₹{((quantity > 0 ? quantity * effectiveSaleRate : effectiveSaleRate)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                {effectiveMRPValue > 0 && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '11px', color: '#a33a3a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      MRP
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#9d2c2c', textDecoration: 'line-through' }}>
                      ₹{effectiveMRPValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.InStock !== 0 ? (
                  quantity === 0 ? (
                    <Button
                      variant="contained"
                      onClick={(e) => { handleIncrement(e); }}
                      sx={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '15px',
                        backgroundColor: '#d62828',
                        color: '#ffffff',
                        boxShadow: '0 14px 30px rgba(214, 40, 40, 0.18)',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        }
                      }}
                    >
                      🛒 Add to Cart
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                      <Button
                        onClick={(e) => { handleDecrement(e); }}
                        sx={{
                          minWidth: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          padding: 0,
                          backgroundColor: '#d62828',
                          color: '#ffffff',
                          fontSize: '20px',
                          fontWeight: 700,
                          '&:hover': {
                            backgroundColor: '#b71c1c',
                          }
                        }}
                      >
                        −
                      </Button>
                      <Box sx={{ flexGrow: 1, textAlign: 'center', py: '10px', borderRadius: '14px', backgroundColor: '#fff5f5', border: '1px solid rgba(214, 40, 40, 0.18)' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#d62828' }}>{quantity}</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#a32f2f' }}>Selected: {unitText}</Typography>
                      </Box>
                      <Button
                        onClick={(e) => { handleIncrement(e); }}
                        sx={{
                          minWidth: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          padding: 0,
                          backgroundColor: '#d62828',
                          color: '#ffffff',
                          fontSize: '20px',
                          fontWeight: 700,
                          '&:hover': {
                            backgroundColor: '#b71c1c',
                          }
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  )
                ) : (
                  <Button disabled sx={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    background: '#f5f5f5',
                    color: '#999',
                    border: '1px solid #ddd'
                  }}>
                    Out of Stock
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>

  );
};

const mapStateToProps = (state) => {
  return {
    get_fav_lists: state.get_fav_lists, // Get favourite lists from Redux state (Wishlists)
  };
};

export default connect(mapStateToProps, null)(ProductCard);
