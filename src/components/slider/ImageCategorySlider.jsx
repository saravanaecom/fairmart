import React from 'react';
import { Container, Box, Grid } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';

export default function ImageCategorySlider({ CategoryImageLists = [] }) {
  // IntersectionObserver Hook
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

  // Early return for empty or invalid image lists
  if (!CategoryImageLists || CategoryImageLists.length === 0) {
    return null;
  }

  // Filter and flatten the image list
  const images = CategoryImageLists.flatMap((item) =>
    [item.Bannerimg1, item.Bannerimg2, item.Bannerimg3, item.Bannerimg4]
      .filter((img) => img && (img !== 'Undefined.jpg' || img !== 'Undefined.png'))
  );

  return (
    <Container maxWidth="xl" className="px-0">
      <Grid
        container
        spacing={4}
        ref={ref}
        className={`mt-10 transition-transform duration-500 ease-in-out ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Only show two images in one row */}
        {images.slice(0, 4).map((img, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}> {/* Responsive Grid */}
            <Box
              className="p-0 relative overflow-hidden rounded-lg shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <img
                className="w-full h-64 object-cover rounded-lg"
                src={ImagePathRoutes.CategoryImagePath + img}
                alt={`Image ${index + 1}`}
              />
              <Box
                className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-50"
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <style jsx>{`
        /* Glowing effect around the image */
        .wave-effect {
          animation: waveAnimation 2s infinite ease-in-out;
          box-shadow: 0 0 15px rgba(0, 180, 255, 0.7); /* Glow effect */
        }

        /* Keyframe for wave animation (a slight floating/dancing effect) */
        @keyframes waveAnimation {
          0% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </Container>
  );
}   