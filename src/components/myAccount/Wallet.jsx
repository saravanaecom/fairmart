/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RedeemIcon from '@mui/icons-material/Redeem';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ServerURL } from '../../server/serverUrl';
import { API_FetchMyWalletIn } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';

const Wallet = ({customerDetails}) => {
  const theme = useTheme();
  const [walletLists, setWalletLists] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  const FetchMyWalletIn = async (userId) => {
    try {
        const lists = await API_FetchMyWalletIn(userId);
        setWalletLists(lists);
        setIsLoading(false);
    } catch (error) {
        console.error("Error fetching wallet lists:", error);
        setIsLoading(false);
    }
};

useEffect(() => {
  const userId = localStorage.getItem("userId");
  const CId = userId ? decodeURIComponent(userId) : null;
  if (CId) {
    FetchMyWalletIn(atob(CId));
  }
}, []);

  return (
    <Box align="left" sx={{ background: theme.palette.whitecolorCode.main || '#FFF', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
              {/* Balance Card */}
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.whitecolorCode.main || '#3BB77E'} 0%, ${theme.palette.whitecolorCode.main || '#3BB77E'} 100%)`, color: theme.palette.whitecolorCode.main || '#fff' }}>
                <CardContent>
                  <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Grid item xs={8} align="left">
                      <Typography variant="h3" component="div">
                        {26.70.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="body2">
                        Your Balance
                      </Typography>
                      <Button variant="text" sx={{ color: theme.palette.whitecolorCode.main || '#fff', marginTop: 2 }} startIcon={<RedeemIcon />}>
                        Topup wallet
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Box display="flex" justifyContent="flex-end">
                        <AccountBalanceWalletIcon sx={{ fontSize: 60 }} />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Box mt={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Recent Activity</Typography>
                  <Button sx={{ display: 'none' }} variant="text" endIcon={<ArrowForwardIosIcon />}>
                    See All
                  </Button>
                </Box>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Placed Order # CB76ACVRD14648"
                      secondary="31/08/2024 at 08:35am"
                    />
                    <Typography align="right" variant="body2">₹50</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <RedeemIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Wallet Cash - Valid for next order only"
                      secondary="27/08/2024 at 09:16am"
                    />
                    <Box>
                      <Typography align="right" variant="body2" color="success.main">+₹50</Typography>
                      <Typography variant="caption">Expires 26/08/2025</Typography>
                    </Box>
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Placed Order # 3689BCVRG27090"
                      secondary="25/08/2024 at 12:08pm"
                    />
                    <Typography align="right" variant="body2">₹50</Typography>
                  </ListItem>
                </List>
              </Box>
            </Box>
  );
};

export default Wallet;
