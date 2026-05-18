import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';

export default function TermsAndConditions() {
    return (
        <>
           
                <Box elevation={3} sx={{
                    padding: 4, pt: 1, marginTop: 1, backgroundColor: '#ffffff', borderRadius: '8px',
                  
                }} align="left">

                    <Typography variant="h4" fontSize={22} fontWeight={600} gutterBottom align="left" sx={{ color: '#1976d2' }}>
                        Terms and Conditions
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="left">
                        Last Updated on December 30, 2024
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Welcome to <span style={{ color: "#1976d2" }}>FairMart</span>!
                    </Typography>
                    <Typography variant="body1" fontSize={18} lineHeight={1.6}>
                        By accessing or using our website at{" "}
                        <a href="https://www.FairMart.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>
                            www.FairMart.com
                        </a>
                        , you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>General Terms</Typography>
                    <Typography variant="body1" paragraph>
                        These Terms & Conditions govern your use of our website, services, and products. We reserve the right to modify these terms at any time. Updated terms will be posted on this page with the effective date.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Use of the Website</Typography>
                    <Typography variant="body1" paragraph>
                        You must be at least 18 years old or have parental/guardian consent to use this website.
                        You agree not to use the website for any unlawful purpose or in a way that may harm or impair its functionality.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Orders and Payments</Typography>
                    <Typography variant="body1" paragraph>
                        All orders are subject to product availability and confirmation of payment. Prices are listed in [Insert Currency] and include applicable taxes unless otherwise stated. We reserve the right to refuse or cancel any order at our discretion.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Shipping and Delivery</Typography>
                    <Typography variant="body1" paragraph>
                        We aim to process and ship your orders promptly. Delivery times may vary depending on your location. Shipping fees and policies are detailed during the checkout process.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Returns and Refunds</Typography>
                    <Typography variant="body1" paragraph>
                        Please refer to our Returns & Refunds Policy for details on how to return items and request refunds. Items must be returned in their original condition with proof of purchase.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Intellectual Property</Typography>
                    <Typography variant="body1" paragraph>
                        All content on this website, including text, images, logos, and product descriptions, is owned by P2 Music Shop or licensed to us. You may not copy, distribute, or reproduce any content without prior written permission.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Limitation of Liability</Typography>
                    <Typography variant="body1" paragraph>
                        P2 Music Shop shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Contact Us</Typography>
                    <Typography variant="body1" paragraph>
                        If you have any questions about these Terms & Conditions, please contact us at:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        Email:FairMart@gmail.com
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        Phone: +919894820412
                    </Typography>
                </Box>
      
        </>
    );
}
