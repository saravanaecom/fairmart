import React from 'react';
import { Box, Container } from '@mui/material';
import CategoryCard from '../components/category/categoryCard';

function Categories() {
    return (
        <Container maxWidth="xl" 
                disableGutters 
                sx={{ paddingLeft: { xs: 0, sm: 2, md: 3, lg: 4, xl: 5 }, paddingRight: { xs: 0, sm: 2, md: 3, lg: 4, xl: 5 } }}
            >
            <Box className="ShopByCategories">
                <h1 
                    className="text-center font-bold text-2xl sm:text-3xl lg:text-4xl mt-6 mb-6"
                >
                    Shop by Category
                </h1>
                <CategoryCard />
            </Box>
        </Container>
    );
}

export default Categories;
