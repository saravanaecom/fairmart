import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Badge, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import AppCart from '../cart/AppCart';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '@mui/material/styles';
import AppLogin from '../authentication/AppLogin';

export default function AppBottomNavigation() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const {cartItems} = useCart();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    if(isAuthenticated === true){
        setLoginDrawerOpen(false);
    }
    setCartItemsCount(cartItems.length ? cartItems.length : 0);
  }, [isAuthenticated, cartItems]);

  const handleAuthDrawerToggle = (event, flag) => {
    if (flag === 1) {
      setCartDrawerOpen((prev) => !prev);
    } else if (flag === 2) {
      setLoginDrawerOpen((prev) => !prev);
    }
    if(cartDrawerOpen === true){
        setCartDrawerOpen((prev) => !prev);
    }
    else if(loginDrawerOpen === true){
        setLoginDrawerOpen((prev) => !prev);
    }
  };

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/myaccount?page=Favorites');
        break;
      case 2:
        navigate('/categories');
        break;
      case 3:
        handleAuthDrawerToggle(event, 1); 
        break;
      case 4:
        navigate('/myaccount?page=Orders');
        break;
      case 5:
        handleAuthDrawerToggle(event, 2);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppCart CartDrawerOpen={cartDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
      <AppLogin LoginDrawerOpen={loginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
      <Box sx={{ pb: 7 }} ref={ref}>
        <CssBaseline />
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleNavigation}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            {isAuthenticated ? <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} /> : null}
            <BottomNavigationAction label="Categories" icon={<CategoryIcon />} />
            <BottomNavigationAction label="Cart" icon={
              <IconButton color="inherit" onClick={handleAuthDrawerToggle}>
              <Badge badgeContent={cartItemsCount} sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.basecolorCode.main, 
                    color: theme.palette.footertextcolorCode.main
                  },
                }}>
                <ShoppingBagIcon />
              </Badge>
            </IconButton>
            } />
            {isAuthenticated ? <BottomNavigationAction label="Account" icon={<ManageAccountsIcon />} /> : null}
            {!isAuthenticated ? <BottomNavigationAction label="Login" icon={<ManageAccountsIcon />} /> : null}
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
}
