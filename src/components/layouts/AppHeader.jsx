/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, AppBar, Toolbar, Grid, IconButton, Button, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from '../logo/AppLogo';
import AppRegister from '../authentication/AppRegister';
import AppLogin from '../authentication/AppLogin';
import AppCart from '../cart/AppCart';
import AppForgetPassword from '../authentication/AppForgetPassword';
import AppSearchBox from './AppSearchBox';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { ServerURL } from '../../server/serverUrl';

const drawerContent = (
  <List>
    <ListItem button component={Link} to="/">
      <AppLogo />
    </ListItem>
    <ListItem button component={Link} to="/about">
      <ListItemText primary="About Us" />
    </ListItem>
    <ListItem button component={Link} to="/privacy-policy">
      <ListItemText primary="Privacy Policy" />
    </ListItem>
    <ListItem button component={Link} to="/terms-and-conditions">
      <ListItemText primary="Terms & Conditions" />
    </ListItem>
    <ListItem button component={Link} to="/refund-cancellation">
      <ListItemText primary="Refund & Cancellation" />
    </ListItem>
  </List>
);

export default function AppHeader() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, isAuthenticatedName } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [forgetPasswordDrawerOpen, setForgetPasswordDrawerOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const {cartItems} = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen((open) => !open);
  };

  // Authentication right sidebar
  const handleAuthDrawerToggle = (event) => {
    if (event === false) {
      if (registerDrawerOpen === true) {
        setLoginDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen(false);
        setRegisterDrawerOpen((prev) => !prev);
      }
      else if (loginDrawerOpen === true) {
        setRegisterDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen(false);
        setLoginDrawerOpen((prev) => !prev);
      }
      else if (forgetPasswordDrawerOpen === true) {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setForgetPasswordDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setForgetPasswordDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
    else {
      const id = event.currentTarget.id;
      if (id === "register_btn") {
        setLoginDrawerOpen(false);
        setCartDrawerOpen(false);
        setRegisterDrawerOpen((prev) => !prev);
      }
      else if (id === "login_btn") {
        setRegisterDrawerOpen(false);
        setCartDrawerOpen(false);
        setLoginDrawerOpen((prev) => !prev);
      }
      else {
        setRegisterDrawerOpen(false);
        setLoginDrawerOpen(false);
        setCartDrawerOpen((prev) => !prev);
      }
    }
  };

  // Handle scroll event to animate header
  useEffect(() => {   
    setCartItemsCount(cartItems.length ? cartItems.length : 0);
    
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cartItems]);

  return (
    <>
      <AppBar
        position={isScrolled ? 'sticky' : 'relative'}
        color="transparent"
        elevation={isScrolled ? 5 : 4}

        sx={{
          borderBottom: isScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
          backgroundColor: '#d62828',
          backgroundImage: 'linear-gradient(180deg, rgba(214,40,40,0.98) 0%, rgba(246,147,31,0.12) 100%)',
          transition: 'background-color 0.5s ease, box-shadow 0.3s ease',
          boxShadow: isScrolled ? '0 6px 18px rgba(0, 0, 0, 0.18)' : 'none',
          zIndex: 9,
          top: 0,
          height: '70px',
          color: '#ffffff',
          '@media (max-width: 600px)': {
            position: 'relative',
            width: '100%',
          },
        }}
      >
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">

            {/* Logo Section */}
            <Grid item xs={6} sm={2} md={2} >
              <Link to={"/"}> <AppLogo /></Link>
            </Grid>

            {/* Hamburger Menu for Mobile */}
            <Grid item xs={6} sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end' }}>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ width: '30px', height: '30px' }} />
              </IconButton>
            </Grid>

            {/* Search Bar Section */}
            <Grid
              item
              xs={12} sm={6} md={5}
              sx={{
                display: { sm: 'inline-block' },
                alignItems: 'center',
                mt: { xs: 1, sm: 0 },
                position: 'relative', // Remove fixed positioning for mobile
                left:'50px',
                width: '100%',
                zIndex: 9,
              }}
            >
              <AppSearchBox/>              
            </Grid>

            {/* Navigation and User Action Section */}
            <Grid item xs={6} sm={3} md={5} sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end', alignItems: 'center', gap: '30px' }}>
              <Button sx={{ color: '#FFF', textTransform: 'none', display: { xs: 'none', md: 'block' } }}>
                <Typography component={"p"} sx={{ fontFamily: 'inherit', fontWeight: 600 }}>WhatsApp Only<br />
                <span style={{fontSize: 14}}>+916597236749</span>
                </Typography>
              </Button>
              <Button sx={{ color: '#333', fontWeight: 600, fontFamily: 'inherit', textTransform: 'none', display: { xs: 'none', md: 'none' } }}><Link to={"/"}>Home</Link></Button>
              {!isAuthenticated && (
                <>
                  <Button
                    id={"register_btn"}
                    sx={{
                      color: '#002134',
                      backgroundColor: '#f9c74f',
                      textTransform: 'none',
                      borderRadius: '24px',
                      px: 2.2,
                      py: 0.9,
                      '&:hover': { backgroundColor: '#f5b834' },
                    }}
                    onClick={handleAuthDrawerToggle}
                  >
                    <Typography sx={{ fontFamily: 'inherit', fontWeight: 700 }}>Register</Typography>
                  </Button>

                  <Button
                    id={"login_btn"}
                    sx={{
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.8)',
                      textTransform: 'none',
                      borderRadius: '24px',
                      px: 2.2,
                      py: 0.9,
                      border: '1px solid rgba(255,255,255,0.85)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
                    }}
                    onClick={handleAuthDrawerToggle}
                  >
                    <Typography sx={{ fontFamily: 'inherit', fontWeight: 700 }}>Sign In</Typography>
                    <PersonIcon sx={{ ml: 1, color: '#ffffff' }} />
                  </Button>
                </>
              )}

              {isAuthenticated && (
                <Button
                  id={"profile_btn"}
                  sx={{ color: '#FFF', textTransform: 'none' }}
                >
                  <PersonIcon sx={{ ml: 1 }} />
                  <Typography sx={{ fontFamily: 'inherit', fontWeight: 600 }}><Link to={"/myaccount"}>{isAuthenticatedName !== '' ? isAuthenticatedName : 'Profile'}</Link></Typography>
                </Button>

                
              )}

            {isAuthenticated && (
          <IconButton color="#FFF" onClick={() => navigate("/Favproduct")}>
        <FavoriteIcon sx={{ ml: 1 ,color :"#FFF" }}/>
      </IconButton>
      )}

              <IconButton color="inherit" onClick={handleAuthDrawerToggle}>
                <Badge badgeContent={cartItemsCount} sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.basecolorCode.main, 
                      color: theme.palette.footertextcolorCode.main
                    },
                  }}>
                <ShoppingBagIcon sx={{ color: "white" }} />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>

        {/* Drawer for Mobile Navigation */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
        <AppRegister RegisterDrawerOpen={registerDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppLogin LoginDrawerOpen={loginDrawerOpen} setRegisterDrawerOpen={setRegisterDrawerOpen} setForgetPasswordDrawerOpen={setForgetPasswordDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppCart CartDrawerOpen={cartDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
        <AppForgetPassword ForgetPasswordDrawerOpen={forgetPasswordDrawerOpen} setLoginDrawerOpen={setLoginDrawerOpen} handleAuthDrawerToggle={handleAuthDrawerToggle} />
      </AppBar>
    </>
  );
}
