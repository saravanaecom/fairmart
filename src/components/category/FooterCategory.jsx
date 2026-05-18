import React from 'react';
import { Grid, Typography } from '@mui/material';

const categories = [    
      { "id": 1, "category_name": "Fruits & Vegetables" },
      { "id": 2, "category_name": "Atta, Rice, Oil & Dals" },
      { "id": 3, "category_name": "Masala & Dry Fruits" },
      { "id": 4, "category_name": "Frozen Food & Ice Creams" },
      { "id": 5, "category_name": "Baby Food" },
      { "id": 6, "category_name": "Dairy, Bread & Eggs" },
      { "id": 7, "category_name": "Cold Drinks & Juices" },
      { "id": 8, "category_name": "Meats, Fish & Eggs" },
      { "id": 9, "category_name": "Breakfast & Sauces" },
      { "id": 10, "category_name": "Tea, Coffee & More" },
      { "id": 11, "category_name": "Biscuits" },
      { "id": 12, "category_name": "Sweet Cravings" },
      { "id": 13, "category_name": "Cleaning Essentials" },
      { "id": 14, "category_name": "Home Needs" },
      { "id": 15, "category_name": "Electricals & Accessories" },
      { "id": 16, "category_name": "Munchies" },
      { "id": 17, "category_name": "Makeup & Beauty" },
      { "id": 18, "category_name": "Hygiene & Grooming" },
      { "id": 19, "category_name": "Homegrown Brands" },
      { "id": 20, "category_name": "Paan Corner" },
      { "id": 21, "category_name": "Bath & Body" },
      { "id": 22, "category_name": "Health & Baby Care" }
];
  

export default function FooterCategories() {
  return (
    <Grid container spacing={3}>
      {categories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Typography fontSize={14} component="p">
            {category.category_name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
