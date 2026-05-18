import React, { useState, useEffect } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { API_FetchBannerOfferPost } from "../services/bannerOfferPostServices";
import { ImagePathRoutes } from "../routes/ImagePathRoutes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const TopOfferShow = () => {
    const [ToppostLists, setToppostLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    function handleViewBtnClick (id, value){
        if(id !== 'all_categories'){
          navigate(`/product-list?pcid=${btoa(id)}&pcname=${btoa(value)}`);
        }
        else{
          navigate(`/categories?cid=${btoa(id)}&cname=${btoa(value)}`);
        }
      };

    const GetBannerSliderLists = async () => {
        try {
            const bannerList = await API_FetchBannerOfferPost();

            const filteredList = bannerList.filter((item) => item.istopoffer === 1);
            setToppostLists(filteredList);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        GetBannerSliderLists();
    }, []);

    // Slick Slider settings
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,  // Show 4 images in a row on large screens
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true, // Show left and right arrows
        responsive: [
            {
                breakpoint: 1024, // Tablets
                settings: {
                    slidesToShow: 2, // Show 2 images per row on tablets
                },
            },
            {
                breakpoint: 600, // Mobile devices
                settings: {
                    slidesToShow: 1, // Show 1 image per row on mobile
                    autoplay: true,
                },
            },
        ],
    };

    return (
        <Box sx={{ position: "relative", overflow: "hidden", width: "100%", p: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    mb: 2,
                    color: "#333",
                }}
            >
                TOP OFFERS
            </Typography>

            {isLoading ? (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            height: { xs: 200, sm: 320, md: 400, lg: 500 },
                            width: "100%",
                            borderRadius: "12px",
                            margin: "0 auto",
                        }}
                    />
                </Box>
            ) : (
                <Slider {...settings}>
                    {ToppostLists.map((item, index) => (
                        <Box key={item.Id} sx={{ px: 1 }}> {/* Padding between items */}
                      {   
                      <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: "250px", // Set a fixed height for uniform size
                                    overflow: "hidden",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                }}

                                value="offer_product"
                                id="offer_product"
                              onClick={() => handleViewBtnClick('offer_product', 'Offer Products')}
                            >
                              
                                <img
                                    src={ImagePathRoutes.BannerOfferPostImagePath + item.Imagepath}
                                    alt={item.Imagepath}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        display: "block",
                                    }}
                                />
                            </Box>}
                        </Box>
                    ))}
                </Slider>
            )}
        </Box>
    );
};

export default TopOfferShow;
