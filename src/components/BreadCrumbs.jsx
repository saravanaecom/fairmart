import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


export default function BreadCrumbs({CategoryId, CategoryName, SubCateoryId, SubCategoryName, ProductName}) {
  const navigate = useNavigate();

  const handleClick = (CategoryId, CategoryName, SubCateoryId, SubCategoryName) => {
    //navigate(`/product-list?pcid=${btoa(CategoryId)}&pcname=${btoa(CategoryName)}&pscid=${btoa(SubCateoryId)}&pscname=${SubCategoryName}`);
    navigate(`/product-list?pcid=${btoa(CategoryId)}&pcname=${btoa(CategoryName)}`);
  };

  const breadcrumbs = [
    <Typography key="1" sx={{cursor: 'pointer', color:"black"}} fontSize={13} font onClick={handleClick}>
      Home
    </Typography>,
    <Typography
      fontSize={13}
      key="2"      
      sx={{cursor: 'pointer', color:"black"}}
      id={CategoryId}
      dataId={SubCateoryId}
      onClick={(event) => handleClick(CategoryId, CategoryName, SubCateoryId, SubCategoryName)}
    >
      {CategoryName ? CategoryName : SubCategoryName}
    </Typography>,
    <Typography key="3" fontSize={14} color="inherit">
      {ProductName}
    </Typography>,
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>      
    </Stack>
  );
}
