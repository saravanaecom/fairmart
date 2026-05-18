/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Autocomplete, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { API_SearchByProduct } from '../../services/productListServices';

const AppSearchBox = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchLists, setSearchLists] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [SearchKeyword, setSearchKeyword] = useState('');

  const GetSearchByProducts = async (keyWord) => {
    try {
      const searchLists = await API_SearchByProduct(keyWord);
      setSearchLists(searchLists);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lists:", error);
      setIsLoading(false);
    }
  };

  const handleSearchProducts = (keyWord) => {
    setSearchKeyword(keyWord);
    if (keyWord.length > 1) {
      GetSearchByProducts(keyWord);
    }
  };

  //View product description page
  const handleProductClick = (event) => {
    const pdId = event.currentTarget.id;
    const pdValue = event.currentTarget.getAttribute('name');   
    setSearchLists([]);
    setSearchKeyword('');
    navigate(`/product-details?pdid=${encodeURIComponent(btoa(pdId))}&pdname=${encodeURIComponent(btoa(pdValue))}`);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ width: 'auto', margin: '0 auto', padding: '20px' }}>
      <Autocomplete
        freeSolo
        options={searchLists}
        getOptionLabel={(option) => option.Description}
        inputValue={SearchKeyword}
        onInputChange={(event, newValue) => handleSearchProducts(newValue)} 
        renderInput={(params) => (
          <TextField
          {...params}
          label="Search for products"
          variant="outlined"
          sx={{
            borderRadius: '25px',
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              '& fieldset': {
                borderColor: '#1709b3',
              },
              '&:hover fieldset': {
                borderColor: '#03129c',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#81c784',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#756868',
              fontWeight: 'bold',
              '&.Mui-focused': {
                color: '#756868',
              },
              '&:hover': {
                color: '#756868',
              },
            },
            '& .MuiInputBase-input': {
              color: '#333',
            },
          }}
          autoComplete={"off"}
          size="small"
        />
        
        )}
        renderOption={(props, option) => (
          <List {...props} key={option.Id} 
          id={option?.Productid ? option.Productid : option?.Id}
          name={option.Description}
          value={option?.Productid ? option.Productid : option?.Id}
          onClick={handleProductClick}
          >
            <ListItem style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '15px', backgroundColor: '#ffffff', marginBottom: '5px' }}>
              <ListItemAvatar>
                <Avatar src={ImagePathRoutes.ProductImagePath + option.Img0} alt={option.Description} />
              </ListItemAvatar>
              <ListItemText
                primary={option.Description}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {option.Price.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        )}
      />
    </div>
  );
};

export default AppSearchBox;
