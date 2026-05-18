import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardMedia } from '@mui/material';
import { API_FetchCategory } from '../../services/categoryServices';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { useTheme } from '@mui/material/styles';

const CategoryCards = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [categoryLists, setCategoryLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleCategoryClickChange = (event, id, newValue) => {
        const selectedCategoryId = event.currentTarget.id;
        navigate(`/product-list?pcid=${btoa(selectedCategoryId)}&pcname=${btoa(newValue)}`);
    };

    const fetchCategoryLists = async () => {
        try {
            const categoryList = await API_FetchCategory();
            setCategoryLists(categoryList.slice(0, 5)); // Show only the first 5 categories
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategoryLists();
    }, []);

    return (
        <Box className="p-4">
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'left',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    marginBottom: 4,
                }}
            >
                Categories
            </Typography>
            <Grid container spacing={8} justifyContent="center">
                {/* First row with two cards */}
                <Grid container item xs={12} spacing={2}>
                    {/* First Card */}
                    <Grid item xs={12} sm={6} md={8}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.3)', // Neumorphism shadow
                                borderRadius: 2,
                                overflow: 'hidden',
                                height: '300px', // Set a fixed height for the card
                                position: 'relative',
                                width: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.1), -15px -15px 30px rgba(255, 255, 255, 0.4)',
                                    transform: 'scale(1.05)',
                                }
                            }}
                            id={categoryLists[0]?.Id}
                            onClick={(event) => handleCategoryClickChange(event, categoryLists[0]?.Id, categoryLists[0]?.Category)}
                        >
                            <CardMedia
                                component="img"
                                height="100%" // Set image to take full height of the card
                                image={categoryLists[0]?.ImagePath ? ImagePathRoutes.CategoryImagePath + categoryLists[0]?.ImagePath : '/path/to/fallback/logo.png'}
                                alt={categoryLists[0]?.Category}
                                sx={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Adding text shadow for better visibility
                                    padding: '10px 20px', // Adding padding around text
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slight transparent background to highlight the text
                                    borderRadius: '10px', // Rounded corners for the text box
                                }}
                            >
                                {categoryLists[0]?.Category}
                            </Typography>
                        </Card>
                    </Grid>

                    {/* Second Card (Smaller width) */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.3)', // Neumorphism shadow
                                borderRadius: 2,
                                overflow: 'hidden',
                                height: '300px',
                                position: 'relative',
                                width: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.1), -15px -15px 30px rgba(255, 255, 255, 0.4)',
                                    transform: 'scale(1.05)',
                                }
                            }}
                            id={categoryLists[1]?.Id}
                            onClick={(event) => handleCategoryClickChange(event, categoryLists[1]?.Id, categoryLists[1]?.Category)}
                        >
                            <CardMedia
                                component="img"
                                height="100%" // Set image to take full height of the card
                                image={categoryLists[1]?.ImagePath ? ImagePathRoutes.CategoryImagePath + categoryLists[1]?.ImagePath : '/path/to/fallback/logo.png'}
                                alt={categoryLists[1]?.Category}
                                sx={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    padding: '10px 20px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    borderRadius: '10px',
                                }}
                            >
                                {categoryLists[1]?.Category}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Second row with three cards */}
                <Grid container item xs={12} spacing={2}>
                    {categoryLists.slice(2, 5).map((item, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.3)', // Neumorphism shadow
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    height: '300px',
                                    position: 'relative',
                                    width: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.1), -15px -15px 30px rgba(255, 255, 255, 0.4)',
                                        transform: 'scale(1.05)',
                                    }
                                }}
                                id={item.Id}
                                onClick={(event) => handleCategoryClickChange(event, item.Id, item.Category)}
                            >
                                <CardMedia
                                    component="img"
                                    height="100%" // Set image to take full height of the card
                                    image={item.ImagePath ? ImagePathRoutes.CategoryImagePath + item.ImagePath : '/path/to/fallback/logo.png'}
                                    alt={item.Category}
                                    sx={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        padding: '10px 20px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                        borderRadius: '10px',
                                    }}
                                >
                                    {item.Category}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default CategoryCards;
