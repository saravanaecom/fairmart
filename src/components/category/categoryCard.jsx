/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box } from '@mui/material';
import { API_FetchCategory } from '../../services/categoryServices';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { useTheme } from '@mui/material/styles';

const CategoryCard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [categoryLists, setCategoryLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleCategoryClickChange = (event, id, newValue) => {
        const selectedCategoryId = event.currentTarget.id;
        navigate(`/product-list?pcid=${btoa(selectedCategoryId)}&pcname=${btoa(newValue)}`);
    };
    
    const ShopByCategoryLists = async () => {
        try {
            const categoryList = await API_FetchCategory();
            setCategoryLists(categoryList);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        ShopByCategoryLists();
    }, []);

    return (
        <Box className="p-4">
            <Grid container spacing={4} justifyContent="center">
                {categoryLists.map((item, index) => (
                    <Grid
                        item
                        key={index}
                        xs={6} sm={4} md={3} lg={3}
                        className=""
                    >
                        {/* Image container */}
                        <Box sx={{cursor: 'pointer'}} key={index} id={item.Id} value={item.Category} onClick={(event) => handleCategoryClickChange(event, item.Id, item.Category)}>
                            <img
                                src={ImagePathRoutes.CategoryImagePath + item.ImagePath}
                                alt={item.Category}
                                className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden shadow-md"
                            //className="object-cover w-full h-full"
                            />
                            <Typography
                                variant="body1"
                                sx={{ mt: 1, color: theme.palette.lightblackcolorCode.main }}
                                className="w-full text-center text-sm sm:text-md lg:text-lg font-medium"
                            >
                                {item.Category}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategoryCard;
