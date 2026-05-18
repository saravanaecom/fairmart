import React from 'react';
import { Box, Container } from '@mui/material';
import FavProductCard from '../components/FavProductCard';

function Favorites() {
    return (
        <Container maxWidth="xl">
            <Box>
                <FavProductCard/>
            </Box>
        </Container>
    );
}

export default Favorites;
