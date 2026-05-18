import React from 'react';
import { Button, Avatar, Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Sidebar = ({ CustomerDetails, setActiveComponent }) => {
  const theme = useTheme();
  const customerName = CustomerDetails && CustomerDetails[0] ? CustomerDetails[0].CustomerName : '';
  const mobileNo = CustomerDetails && CustomerDetails[0] ? CustomerDetails[0].MobileNo : '';

  return (
    <Box sx={{ bgcolor: 'white', height: '100%' }}>
      <Box sx={{ border: '1px solid #efefef', borderLeft: 'none', borderBottom: 'none' }}>
        <Box>
          <Box display="flex" alignItems="center" mb={2}
            sx={{
              background: theme.palette.shadowcolorCode.main,
              padding: '1rem',
              borderTopLeftRadius: '.75rem',
              borderTopRightRadius: '.75rem'
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.basecolorCode.main }}></Avatar>
            <Box ml={2}>
              <Typography sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} variant="h6">{customerName}</Typography>
              <Typography sx={{display: {xs: 'none', sm: 'none', md: 'block'}, textAlign: 'left'}} variant="body2" color="textSecondary">
                +91 {mobileNo}
              </Typography>
            </Box>
          </Box>
        </Box>
        <List>
          <ListItem sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('Orders')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.70591 12.5294L8.70591 8.76472C8.70591 6.68553 10.3914 5.00001 12.4706 5.00001V5.00001C14.5498 5.00001 16.2353 6.68553 16.2353 8.76472L16.2353 12.5294" stroke="black" stroke-linecap="round" stroke-width="1.8"></path><path d="M4.6535 13.1579C4.79005 11.5194 4.85832 10.7001 5.39863 10.203C5.93895 9.70581 6.76103 9.70581 8.40521 9.70581H16.536C18.1801 9.70581 19.0022 9.70581 19.5425 10.203C20.0829 10.7001 20.1511 11.5194 20.2877 13.1579L20.7713 18.9613C20.8508 19.9152 20.8905 20.3921 20.6109 20.696C20.3313 20.9999 19.8527 20.9999 18.8954 20.9999H6.04574C5.08851 20.9999 4.6099 20.9999 4.33028 20.696C4.05065 20.3921 4.0904 19.9152 4.16989 18.9613L4.6535 13.1579Z" stroke="black" stroke-width="1.8"></path></svg></ListItemIcon>
            <ListItemText sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>Orders</ListItemText>
          </ListItem>
          <ListItem sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('Favorites')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 27 27" width="24" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="26" transform="translate(0.807861 0.757812)" width="26"></rect><path d="M4.68006 15.5556L12.6144 23.0986C12.8862 23.3569 13.0221 23.4861 13.1818 23.5213C13.2648 23.5395 13.3509 23.5395 13.4339 23.5213C13.5936 23.4861 13.7295 23.3569 14.0013 23.0986L21.9357 15.5556C24.1375 13.4624 24.4056 10.0454 22.5572 7.63444L22.1692 7.12838C19.9401 4.22085 15.4238 4.70457 13.861 8.01824C13.6405 8.48585 12.9752 8.48585 12.7547 8.01824C11.1919 4.70457 6.67561 4.22085 4.44651 7.12838L4.05854 7.63444C2.21012 10.0454 2.47823 13.4624 4.68006 15.5556Z" stroke="black" stroke-width="1.6"></path></svg></ListItemIcon>
            <ListItemText sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>Favorites</ListItemText>
          </ListItem>
          <ListItem sx={{ display: 'none', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('CustomerSupport')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 26 26" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 13C3 7.47715 7.47715 3 13 3V3C18.5228 3 23 7.47715 23 13V19.3636C23 20.4219 23 20.951 22.8424 21.3737C22.589 22.0531 22.0531 22.589 21.3737 22.8424C20.951 23 20.4219 23 19.3636 23H13C7.47715 23 3 18.5228 3 13V13Z" stroke="black" stroke-width="1.6"></path><path d="M9.25 11.75L16.75 11.75" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"></path><path d="M13 16.75H16.75" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"></path></svg></ListItemIcon>
            <ListItemText sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>Customer Support</ListItemText>
          </ListItem>          
          <ListItem sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('Addresses')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 26 26" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12.9204 18.682L12.552 17.9718H12.552L12.9204 18.682ZM12.0801 18.682L12.4484 17.9718H12.4484L12.0801 18.682ZM19.0891 9.38889C19.0891 11.7465 17.8884 13.6759 16.4236 15.1534C14.9596 16.63 13.2988 17.5845 12.552 17.9718L13.2887 19.3921C14.1073 18.9675 15.9308 17.923 17.5598 16.2798C19.1881 14.6375 20.6891 12.3263 20.6891 9.38889H19.0891ZM12.5002 2.8C16.1392 2.8 19.0891 5.74995 19.0891 9.38889H20.6891C20.6891 4.86629 17.0228 1.2 12.5002 1.2V2.8ZM5.91133 9.38889C5.91133 5.74995 8.86127 2.8 12.5002 2.8V1.2C7.97762 1.2 4.31133 4.86629 4.31133 9.38889H5.91133ZM12.4484 17.9718C11.7017 17.5845 10.0408 16.63 8.57682 15.1534C7.11206 13.6759 5.91133 11.7465 5.91133 9.38889H4.31133C4.31133 12.3263 5.8123 14.6375 7.44059 16.2798C9.06961 17.923 10.8932 18.9675 11.7117 19.3921L12.4484 17.9718ZM12.552 17.9718C12.5307 17.9828 12.5135 17.9858 12.5002 17.9858C12.4869 17.9858 12.4697 17.9828 12.4484 17.9718L11.7117 19.3921C12.2096 19.6504 12.7908 19.6504 13.2887 19.3921L12.552 17.9718ZM14.8668 9.38932C14.8668 10.6964 13.8072 11.756 12.5002 11.756V13.356C14.6909 13.356 16.4668 11.5801 16.4668 9.38932H14.8668ZM12.5002 7.02266C13.8072 7.02266 14.8668 8.08225 14.8668 9.38932H16.4668C16.4668 7.19859 14.6909 5.42266 12.5002 5.42266V7.02266ZM10.1335 9.38932C10.1335 8.08225 11.1931 7.02266 12.5002 7.02266V5.42266C10.3094 5.42266 8.5335 7.19859 8.5335 9.38932H10.1335ZM12.5002 11.756C11.1931 11.756 10.1335 10.6964 10.1335 9.38932H8.5335C8.5335 11.5801 10.3094 13.356 12.5002 13.356V11.756Z" fill="black"></path><path d="M20.7272 18.3607C21.561 18.8421 22 19.3881 22 19.944C22 20.4999 21.561 21.0459 20.7272 21.5273C19.8934 22.0087 18.6942 22.4085 17.25 22.6864C15.8058 22.9644 14.1676 23.1107 12.5 23.1107C10.8324 23.1107 9.19418 22.9644 7.75 22.6864C6.30582 22.4085 5.10656 22.0087 4.27276 21.5273C3.43896 21.046 3 20.4999 3 19.944C3 19.3881 3.43896 18.8421 4.27276 18.3607" stroke="black" stroke-linecap="round" stroke-width="1.6"></path></svg></ListItemIcon>
            <ListItemText primary="Addresses" sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} />
          </ListItem>
          <ListItem sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('PasswordSettings')}>
            <ListItemIcon>
              <svg fill="none" height="24" viewBox="0 0 26 26" width="24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Password settings" sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} />
          </ListItem>
          <ListItem sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('ManageReferrals')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 27 27" width="24" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="26" transform="translate(0.807861 0.757812)" width="26"></rect><path d="M4.68006 15.5556L12.6144 23.0986C12.8862 23.3569 13.0221 23.4861 13.1818 23.5213C13.2648 23.5395 13.3509 23.5395 13.4339 23.5213C13.5936 23.4861 13.7295 23.3569 14.0013 23.0986L21.9357 15.5556C24.1375 13.4624 24.4056 10.0454 22.5572 7.63444L22.1692 7.12838C19.9401 4.22085 15.4238 4.70457 13.861 8.01824C13.6405 8.48585 12.9752 8.48585 12.7547 8.01824C11.1919 4.70457 6.67561 4.22085 4.44651 7.12838L4.05854 7.63444C2.21012 10.0454 2.47823 13.4624 4.68006 15.5556Z" stroke="black" stroke-width="1.6"></path></svg></ListItemIcon>
            <ListItemText sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>Manage Referrals</ListItemText>
          </ListItem>
          <ListItem sx={{ display: 'none', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('Profile')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 26 26" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12.5" cy="11.168" r="3.5" stroke="black" stroke-linecap="round" stroke-width="1.6"></circle><circle cx="12.5" cy="13.5" r="10.5" stroke="black" stroke-width="1.6"></circle><path d="M19.5 21.3236C19.0871 20.0832 18.1773 18.9872 16.9117 18.2054C15.646 17.4237 14.0953 17 12.5 17C10.9047 17 9.35398 17.4237 8.08835 18.2054C6.82271 18.9872 5.91289 20.0832 5.5 21.3236" stroke="black" stroke-linecap="round" stroke-width="1.6"></path></svg></ListItemIcon>
            <ListItemText primary="Profile"  sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} />
          </ListItem>
          <ListItem sx={{ display: 'none', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '1px solid #ececec' }} button onClick={() => setActiveComponent('Wallet')}>
            <ListItemIcon><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 6V18C3.75 18.3978 3.90804 18.7794 4.18934 19.0607C4.47064 19.342 4.85218 19.5 5.25 19.5H20.25C20.4489 19.5 20.6397 19.421 20.7803 19.2803C20.921 19.1397 21 18.9489 21 18.75V8.25C21 8.05109 20.921 7.86032 20.7803 7.71967C20.6397 7.57902 20.4489 7.5 20.25 7.5H5.25C4.85218 7.5 4.47064 7.34196 4.18934 7.06066C3.90804 6.77936 3.75 6.39782 3.75 6ZM3.75 6C3.75 5.60218 3.90804 5.22064 4.18934 4.93934C4.47064 4.65804 4.85218 4.5 5.25 4.5H18" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"></path><path d="M16.875 14.625C17.4963 14.625 18 14.1213 18 13.5C18 12.8787 17.4963 12.375 16.875 12.375C16.2537 12.375 15.75 12.8787 15.75 13.5C15.75 14.1213 16.2537 14.625 16.875 14.625Z" fill="white"></path></svg></ListItemIcon>
            <ListItemText primary="Wallet"  sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}/>
          </ListItem>
          <Button onClick={() => setActiveComponent('Logout')} sx={{ justifyContent: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem', borderBottom: '0px solid #ececec' }}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <Typography sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>Log Out</Typography>
          </Button>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
