import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function CategoryHeader({ CategoryHeading, categoryId, categoryValue }) {
  const theme = useTheme();
  const navigate = useNavigate();

  function handleViewBtnClick (event){
    navigate(`/product-list?pcid=${btoa(event.currentTarget.id)}&pcname=${btoa(event.target.value)}`);
  };

  return (
    <div className="flex justify-between items-center mb-5">
      <Typography 
        component={'h2'}
        className="font-bold"
        sx={{ 
          fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px', xl: '22px' }, 
          fontWeight: 600,
        }}
      >
        {CategoryHeading}
      </Typography>
      <Button
        id={categoryId}
        name={CategoryHeading}
        value={categoryValue}
        variant="outlined"
        onClick={handleViewBtnClick}
        endIcon={<ArrowForward />}
        sx={{
          textTransform: 'capitalize',
          mt: { xs: 2, sm: 0 }, 
          fontSize: { xs: '12px', sm: '12px', md: '12px', lg: '14px', xl: '14px' }, 
          padding: { xs: '1px 5px', sm: '2px 7px', md: '3px 8px' }, 
          background: 'none',
          borderColor: theme.palette.lightblackcolorCode.main || '#253D4E',
          color: theme.palette.lightblackcolorCode.main || '#253D4E',
          '&:hover': {
            background: theme.palette.lightblackcolorCode.main || '#253D4E',
            color: theme.palette.whitecolorCode.main || '#FFF',
          }
        }}
      >
        View All
      </Button>
    </div>
  );
}

export default CategoryHeader;
