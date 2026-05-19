import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { ServerURL } from '../server/serverUrl';

export default function RefundAndCancellation() {
    return (
        <>
            <Container  maxWidth="xl" sx={{px: { xs: 0, md: 3 }}}>
                <Box elevation={3} sx={{ padding: 4, pt: 1, marginTop: 1 }} align="left">
                    <Typography variant="h4" fontSize={22} fontWeight={600} gutterBottom align="left">
                        Refund & Return Policy
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="left">
                        Last Updated on January 01, 2022
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />

                    <Typography variant="h6" fontSize={18} fontWeight={600}>Cancellation</Typography>
                    <Typography variant="body1" paragraph>
                        For cancellation of any order please call us at "" or mail us at "" with user name and order id. If the order is already dispatched from our premises, you can not cancel the order but you can return it once it reaches your doorstep. If any goods returned by you do not adhere to the above policy, then we reserve the right to terminate our services to you.
                    </Typography>

                    <Divider sx={{ margin: '20px 0' }} />                    

                    <Typography variant="h6" fontSize={18} fontWeight={600}>In case of any complaints call us at :-</Typography>
                    <Typography variant="body1" paragraph>
                        {ServerURL.COMPANY_ADDRESS}<br />
                        Mobile: {ServerURL.COMPANY_MOBILE}<br />
                        Email: <a href={ServerURL.COMPANY_EMAIL}>{ServerURL.COMPANY_EMAIL}</a>
                    </Typography>
                </Box>
            </Container>
        </>
    )
};