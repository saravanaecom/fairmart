/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardMedia, Typography } from '@mui/material';
import { ServerURL } from '../server/serverUrl';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import { useCart } from '../context/CartContext';
import { useTheme } from '@mui/material/styles';

const FavProductCard = ({ FavProductLists, handleRemoveFavProduct }) => {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            {FavProductLists.map((list) => {
                return (
                    <FavCard list={list} handleRemoveFavProduct={handleRemoveFavProduct} />
                );
            })}
        </Box>
    );
};

const FavCard = ({ list, handleRemoveFavProduct }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useCart();
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(list?.Price || 0);
    const [productId, setProductId] = useState(0);
    const [productValue, setProductValue] = useState(0);

    const [productWeight, setProductWeight] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedMRP, setselectedMRP] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);


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
        if (list && list.ProductWeightType && list.ProductWeightType.length > 0) {
            const firstWeight = list.ProductWeightType[0];
            if (firstWeight && firstWeight.WeightType) {
                setProductWeight(firstWeight.WeightType);
            }
        }
    }, [list]);


    // Check if the product exists in cartItems
    useEffect(() => {
        const existingProduct = cartItems.find(item => {
            const itemId = item?.Productid ? item.Productid : item?.Id;
            const productId = list?.Productid ? list.Productid : list?.Id;
            return itemId === productId;
        });

        if (existingProduct) {
            setQuantity(existingProduct.item);
            setTotalPrice(existingProduct.totalPrice);
            setCurrentPrice(existingProduct.totalPrice);
        } else {
            setQuantity(0);
            setTotalPrice(list?.Price || 0);
            setCurrentPrice(selectedPrice > 0 ? selectedPrice : list?.Price || 0);
        }
    }, [cartItems, list, selectedPrice]);

    // Update cartItems function
    const updateCartItems = (newQuantity, newTotalPrice, MRP, selected_price) => {
        setCartItems(prevCartItems => {
            const updatedCartItems = [...prevCartItems];
            const productId = list?.Productid ? list.Productid : list?.Id;

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
                        selectedMRP: MRP,
                    };
                } else {
                    // Remove product if the quantity is zero
                    updatedCartItems.splice(existingProductIndex, 1);
                }
            } else if (newQuantity > 0) {
                // Add new product to the cart
                updatedCartItems.push({
                    ...list,
                    item: newQuantity,
                    totalPrice: newTotalPrice,
                    totalMRP: MRP,
                    selectedPrice: selected_price,
                    selectedMRP: MRP,
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
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : list.Price);
        const MRP = newQuantity * list.MRP;

        setQuantity(newQuantity);
        setTotalPrice(newTotalPrice);
        setCurrentPrice(newTotalPrice);
        updateCartItems(newQuantity, newTotalPrice, MRP);
    };

    // Quantity decrement function
    const handleDecrement = (event) => {
        event.stopPropagation();
        const newQuantity = quantity - 1;
        const newTotalPrice = newQuantity * (selectedPrice > 0 ? selectedPrice : list.Price);
        const MRP = newQuantity * list.MRP;

        if (newQuantity === 0) {
            setQuantity(0);
            setTotalPrice(selectedPrice > 0 ? selectedPrice : list.Price);
            updateCartItems(0, selectedPrice > 0 ? selectedPrice : list.Price, MRP);
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
    return (
        <Card
            key={list.Id}
            sx={{
                width: {xs: '100%', sm: '48%'},
                display: 'flex',
                padding: '12px',
                borderRadius: '5px',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.16)',
                marginBottom: '16px'
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                {/* Product name */}
                <Typography
                    align="left"
                    variant="body1"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                        lineHeight: '15px',
                        fontFamily: 'inherit',
                        minHeight: '32px',
                    }}
                >
                    {list.Description}
                </Typography>

                {/* Price, MRP, and Discount */}
                <Box sx={{ py: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
                    <Typography
                        variant="body2"
                        sx={{ color: theme.palette.lightblackcolorCode.main, fontSize: '16px', lineHeight: '30px', fontFamily: 'inherit', textAlign: 'left' }}
                    >
                        {(currentPrice > 0 ? currentPrice : totalPrice).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    {list.MRP && (
                        <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through', fontSize: '14px', fontWeight: 200, color: '#a3a4ae', fontFamily: 'inherit', textAlign: 'left' }}
                        >
                            {'MRP:' + ((selectedMRP > 0 ? selectedMRP : list.MRP)).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                    )}
                </Box>

                {/* Weight */}
                <Typography align="left" variant="body2" sx={{ fontSize: 14, color: theme.palette.colorCode.main }}>
                    {list.UnitType}
                </Typography>

                {/* Cart Button */}
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Button
                        variant="outlined"
                        size='small'
                        sx={{
                            width: 'auto',
                            display: quantity !== 0 ? 'flex' : 'none',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            fontFamily: 'inherit',
                            border: `1px solid ${theme.palette.basecolorCode.main}`,
                            background: theme.palette.basecolorCode.main,
                            color: theme.palette.whitecolorCode.main,
                            padding: { xs: '3px 0px', sm: '3px 0px', md: '3px 0px' },
                            '&:hover': {
                                border: `1px solid ${theme.palette.basecolorCode.main}`,
                                background: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main
                            }
                        }}
                    >
                        <Typography
                            variant="span"
                            onClick={(e) => { handleDecrement(e, list); }}
                            sx={{
                                width: '25%',
                                background: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main,
                                fontFamily: 'inherit'
                            }}
                        >
                            -
                        </Typography>
                        <Typography
                            variant="span"
                            sx={{
                                width: '50%',
                                background: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main,
                                fontFamily: 'inherit'
                            }}
                        >
                            {quantity}
                        </Typography>
                        <Typography
                            variant="span"
                            id={list?.Productid ? list.Productid : list?.Id}
                            name={list.Description}
                            value={list?.Productid ? list.Productid : list?.Id}
                            onClick={(e) => { handleIncrement(e, list); }}
                            sx={{
                                width: '25%',
                                background: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main,
                                fontFamily: 'inherit'
                            }}
                        >
                            +
                        </Typography>
                    </Button>

                    {list.InStock !== 0 ? (
                        <Button
                            variant="outlined"
                            size='small'
                            id={list?.Productid ? list.Productid : list?.Id}
                            name={list.Description}
                            value={list?.Productid ? list.Productid : list?.Id}
                            sx={{
                                display: quantity === 0 ? 'block' : 'none',
                                marginTop: '10px',
                                width: 'auto',
                                textTransform: 'none',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                                border: `1px solid ${theme.palette.basecolorCode.main}`,
                                background: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main,
                                '&:hover': {
                                    border: `1px solid ${theme.palette.basecolorCode.main}`,
                                    background: theme.palette.basecolorCode.main,
                                    color: theme.palette.whitecolorCode.main
                                }
                            }}
                            onClick={(e) => { handleIncrement(e, list); }}
                        >
                            Add
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size='small'
                            sx={{
                                marginTop: '10px',
                                width: 'auto',
                                textTransform: 'none',
                                fontFamily: 'inherit',
                                border: '1px solid #dc3545',
                                backgroundColor: '#dc3545',
                                color: theme.palette.whitecolorCode.main,
                                '&:hover': {
                                    background: '#dc3545',
                                    border: '1px solid #dc3545',
                                    color: theme.palette.whitecolorCode.main
                                }
                            }}
                            disabled
                        >
                            Out of Stock
                        </Button>
                    )}

                    <Box>
                        <Button
                            variant="outlined"
                            id={list.Id}
                            onClick={() => handleRemoveFavProduct(list.Id)}
                            sx={{
                                marginTop: '10px',
                                width: '10%',
                                p: '0px',
                                textTransform: 'none',
                                fontFamily: 'inherit',
                                border: '1px solid #dc3545',
                                color: '#dc3545',
                                '&:hover': {
                                    background: '#FFF',
                                    border: '1px solid #dc3545',
                                    color: '#dc3545'
                                }
                            }}
                        >
                            Remove
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Product Image and Remove Button */}
            <Box>
                <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80 }}
                    image={ImagePathRoutes.ProductImagePath + list.Img0}
                    alt={list.Description}
                />
            </Box>
        </Card>
    )
}

export default FavProductCard;
