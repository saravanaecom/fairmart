import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { Instagram, Twitter, Facebook, LinkedIn } from '@mui/icons-material';
import AppLogo from '../logo/AppLogo';
import PlayStrore from '../../assets/play-store.svg';
import AppStrore from '../../assets/app-store.svg';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';
import { QrCode  } from '@mui/icons-material';
import QrImg from '../../assets/FairMart.png'

const AppFooter = ({ CompanyDetails }) => {
    const theme = useTheme();
    return (
        <>
            <Box sx={{ background: "#222", padding: '50px 20px' }}>
                <Container maxWidth="xl" sx={{ px: { xs: 0, md: 3 } }}>
                    <Grid container justifyContent="space-between" alignItems="flex-start">
                        {/* Left section */}
                        <Grid item xs={12} sm={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                                <Box sx={{  borderRadius: 1 }}>
                                    <AppLogo />
                                </Box>
                                <Box display="flex" gap={2} sx={{ py: 3 }}>
                                    {/* <Link href="#">
                                        <Instagram sx={{ color: theme.palette.footertextcolorCode.main }}/>
                                    </Link>
                                    <Link href="#">
                                        <Twitter sx={{ color: theme.palette.footertextcolorCode.main }}/>
                                    </Link> */}
                                    <a href="https://www.facebook.com/share/18xy89vsMb/">
                                        <Facebook sx={{ color: theme.palette.footertextcolorCode.main }} />
                                    </a>
                                    {/* <Link href="#">
                                        <LinkedIn sx={{ color: theme.palette.footertextcolorCode.main }}/>
                                    </Link> */}
                                </Box>
                                <Typography variant="caption" sx={{ mt: 1, color: theme.palette.footertextcolorCode.main }}>
                                    Developed by Kassapos software solutions Pvt Ltd
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Middle section */}
                        <Grid item xs={12} sm={12} md={3}>
                            <Grid container >
                                <Grid item xs={12}>
                                    <Typography sx={{ color: theme.palette.footertextcolorCode.main, borderBottom: `2px solid ${theme.palette.basecolorCode.main}`, display: 'inline' }} fontWeight={600} variant={'h5'}>Links</Typography>
                                    <Box sx={{ width: '100%', display: 'inline-block', }}>
                                        <List sx={{p: 0, m: 0}}>
                                            <ListItem sx={{p: 0.3, m: 0}} button component={Link} to="/">
                                                <ListItemText sx={{ color: theme.palette.footertextcolorCode.main }} primary="Home" />
                                            </ListItem>
                                            <ListItem sx={{p: 0.3, m: 0}} button component={Link} to="/about-us">
                                                <ListItemText sx={{ color: theme.palette.footertextcolorCode.main }} primary="About Us" />
                                            </ListItem>
                                            <ListItem sx={{p: 0.3, m: 0}} button component={Link} to="/privacy-policy">
                                                <ListItemText sx={{ color: theme.palette.footertextcolorCode.main }} primary="Privacy Policy" />
                                            </ListItem>
                                            <ListItem sx={{p: 0.3, m: 0}} button component={Link} to="/terms-and-conditions">
                                                <ListItemText sx={{ color: theme.palette.footertextcolorCode.main }} primary="Terms & Conditions" />
                                            </ListItem>
                                            <ListItem sx={{p: 0.3, m: 0}} button component={Link} to="/refund-and-cancellation">
                                                <ListItemText sx={{ color: theme.palette.footertextcolorCode.main }} primary="Refund & Cancellation" />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={2}>
                            <Typography sx={{ color: theme.palette.footertextcolorCode.main, borderBottom: `2px solid ${theme.palette.basecolorCode.main}`, display: 'inline' }} fontWeight={600} variant={'h5'}>Official info:</Typography>
                            <Box display="flex" gap={2}>
                                <Typography component={'p'} sx={{ mt: 1, color: theme.palette.footertextcolorCode.main }} className="text-sm sm:text-base lg:text-lg">
                                    {ServerURL.COMPANY_ADDRESS}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography component={'p'} sx={{ mt: 1, color: theme.palette.footertextcolorCode.main }}>Mobile:+91 6597236749</Typography>
                            </Box>
                            <Box>
                                <Typography component={'p'} sx={{ mt: 1, color: theme.palette.footertextcolorCode.main }}>Email: customercare@FairMart.com</Typography>
                            </Box>
                        </Grid>

                        {/* Right section */}
                        <Grid item xs={12} sm={12} md={2}>
                            <Typography sx={{ color: theme.palette.footertextcolorCode.main, borderBottom: `2px solid ${theme.palette.basecolorCode.main}`, display: 'inline' }} fontWeight={600} variant={'h5'}>Download App</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button component={Link} target='_blank' href='' variant="outlined" sx={{ mb: 1, border: `1px solid ${theme.palette.basecolorCode.main}`, color: theme.palette.footertextcolorCode.main }} startIcon={<img src={PlayStrore} alt="Play Store" width="20" />}>
                                    Get it on play store
                                </Button>
                               
                                <img src={QrImg} alt="Play Store" width="150" />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default AppFooter;
