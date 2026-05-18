/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { useCart } from '../../context/CartContext';
import { ServerURL } from '../../server/serverUrl';
import { useTheme } from '@mui/material/styles';

const ProductItemCard = ({ product }) => {
  const theme = useTheme();
  const { cartItems, setCartItems } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(product?.Price || 0);

  const handleIncrement = (event) => {
    event.stopPropagation();
    let cartItemsStorage = JSON.parse(localStorage.getItem('cartItems'));

    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      setCartItems((prevCartItems) => {
        const existingProductIndex = prevCartItems.findIndex(
          (item) => item.Id === product?.Id
        );

        let updatedCartItems;

        if (existingProductIndex >= 0) {
          updatedCartItems = prevCartItems.map((item, index) =>
            index === existingProductIndex
              ? { ...item, item: item.item + 1, totalMRP: product.MRP * (item.item + 1), totalPrice: (product.selectedPrice > 0 ? product.selectedPrice : product.Price) * (item.item + 1),
                selectedPrice: product.selectedPrice,
                selectedMRP: product.MRP * (item.item + 1)
               }
              : item
          );
        } else {
          updatedCartItems = [...prevCartItems, { ...product, item: 1, totalMRP: product.MRP, totalPrice: (product.selectedPrice > 0 ? product.selectedPrice : product.Price),
            selectedPrice: product.selectedPrice,
            selectedMRP: product.selectedMRP
           }];
        }

        if (newQuantity > 1) {
          setTotalPrice((prevPrice) => prevPrice + (product.selectedPrice > 0 ? product.selectedPrice : product.Price));
        }

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        return updatedCartItems;
      });
      return newQuantity;
    });
  };

  const handleDecrement = (event) => {
    event.stopPropagation();

    setCartItems((prevCartItems) => {
      const existingProductIndex = prevCartItems.findIndex(
        (item) => item.Id === product?.Id
      );

      let updatedCartItems = [];

      if (existingProductIndex >= 0) {
        const updatedQuantity = prevCartItems[existingProductIndex].item - 1;

        if (updatedQuantity > 0) {
          // If the product exists and quantity is greater than 0, decrement its quantity
          updatedCartItems = prevCartItems.map((item, index) =>
            index === existingProductIndex
              ? {
                ...item,
                item: updatedQuantity,
                totalMRP: (product.selectedMRP > 0 ? product.selectedMRP : product.MRP) * updatedQuantity,
                totalPrice: (product.selectedPrice > 0 ? product.selectedPrice : product.Price) * updatedQuantity,
                selectedPrice: product.selectedPrice,
                selectedMRP: (product.MRP) * updatedQuantity,
              }
              : item
          );
        } else {
          // If the quantity is 0, remove the item from the cart
          updatedCartItems = prevCartItems.filter(
            (item, index) => index !== existingProductIndex
          );
        }
      } else {
        updatedCartItems = prevCartItems;
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });

    // Decrement quantity state only after checking cart items
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        setTotalPrice((prevPrice) => prevPrice - (product.selectedPrice > 0 ? product.selectedPrice : product.Price));
      }
      return prevQuantity > 0 ? prevQuantity - 1 : 0;
    });
  };


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '5px',
        padding: '10px 0px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#FFF',
      }}
    >
      <Box
        component="img"
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          marginRight: 0,
        }}
        src={ImagePathRoutes.ProductImagePath + product.Img0}
        alt={product.Description}
      />
      <Box>
        <Typography variant="p"
          sx={{
            fontSize: '12px',
            fontWeight: 'bold',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            lineHeight: '12px',
            fontFamily: 'inherit',
            minHeight: '20px',
            width: '150px',
            marginRight: 0,
          }}
        >
          {product.Description}
        </Typography>
        <Typography variant="p" color="textSecondary"
          sx={{
            fontSize: '10px',
          }}
        >
          {product.UnitType}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        sx={{
          width: "20%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.palette.shadowcolorCode.main,
          border: `1px solid ${theme.palette.basecolorCode.main}`,
          color: theme.palette.basecolorCode.main,
          fontFamily: 'inherit',
          marginRight: 0,
          padding: { xs: '4px 0px', sm: '5px 0px', md: '5px 0px' },
          '&:hover': {
            background: theme.palette.shadowcolorCode.main,
            border: `1px solid ${theme.palette.basecolorCode.main}`,
            color: theme.palette.basecolorCode.main,
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
          {product.item}
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
      </Button>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="p" sx={{ fontWeight: 500, fontSize: '14px' }}>
          {product.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY })}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textDecoration: 'line-through', color: '#9e9e9e', fontSize: '12px' }}
        >
          {(product.selectedMRP > 0 ? product.selectedMRP : product.MRP).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY })}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductItemCard;
