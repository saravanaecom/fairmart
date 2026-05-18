import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import FavProductCard from '../FavProductCard';
import { API_FetchMyFavoriteProducts, API_DeleteMyFavoriteProducts } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';
import CircularLoader from '../circular-loader';

const Favorites = ({ setActiveComponent }) => {
    const theme = useTheme();
    const [favProductLists, setFavProductLists] = useState([]);
    const [showLoader, setShowLoader] = React.useState(false);

    const FetchMyFavoriteProducts = async (userId) => {
        setShowLoader(true);
        try {
            const favlist = await API_FetchMyFavoriteProducts(userId);
            if(favlist.length !== 0){
                setFavProductLists(favlist);
            }
            else{
                setFavProductLists([]);
            }
            setShowLoader(false);
        } catch (error) {
            setFavProductLists([]);
            setShowLoader(false);
            console.error("Error fetching favorite product lists:", error);
        }
    };

    //Remove fav list
    const handleRemoveFavProduct = async(ProductId) => {
        let userId = localStorage.getItem("userId");
        userId = userId ? decodeURIComponent(userId) : null;
        try {
            const response = await API_DeleteMyFavoriteProducts(ProductId, Number(atob(userId)));
            if (response.DeleteStatus === 1 && response.ItemmasterRefid !== 0) {
                await FetchMyFavoriteProducts(atob(userId));             
            }
        } catch (error) {
            console.error("Error removing favorite product lists:", error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const CId = userId ? decodeURIComponent(userId) : null;
        if (CId) {
            FetchMyFavoriteProducts(atob(CId));
        }
      }, []);
    

    return (
        <>
            <CircularLoader showLoader={showLoader} />
            <Box sx={{ background: '#FFF', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
                {favProductLists.length !== 0 ?
                <FavProductCard FavProductLists={favProductLists} handleRemoveFavProduct={handleRemoveFavProduct} />
                :
                <Typography
                    variant="h6"
                    sx={{ mt: 3, width: '100%', textAlign: 'center', color: theme.palette.lightblackcolorCode.main || 'grey.600' }}
                  >
                    No favorite products available.
                  </Typography>
                }                
            </Box>
        </>
    );
};

export default Favorites;
