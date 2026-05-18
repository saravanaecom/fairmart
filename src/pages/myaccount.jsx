/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Grid } from '@mui/material';
import MyAccountSidebar from '../components/myAccount/MyAccountSidebar';
import Orders from '../components/myAccount/Orders';
import OrderDetails from '../components/myAccount/OrderDetails';
import Favorites from '../components/myAccount/Favorites';
import CustomerSupport from '../components/myAccount/CustomerSupport';
import Profile from '../components/myAccount/Profile';
import Wallet from '../components/myAccount/Wallet';
import Addresses from '../components/myAccount/Addresses';
import Referrals from '../components/myAccount/Referrals';
import PasswordSettings from '../components/myAccount/PasswordSettings';
import { API_FetchCustomerAddress } from '../services/userServices';
import {useAuth} from '../context/authContext';

const MyAccount = () => {
    const { isAuthenticated, setIsAuthenticated, isAuthenticatedName } = useAuth();
    const [activeComponent, setActiveComponent] = useState('Orders');
    const [customerDetails, setCustomerDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const FetchCustomerAddress = async (userId) => {
        try {
            const address = await API_FetchCustomerAddress(userId);
            setCustomerDetails(address);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching customer address:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const CId = userId ? decodeURIComponent(userId) : null;
        if (CId) {
            FetchCustomerAddress(atob(CId));
        }
    }, []);

    // Set active component based on URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const component = params.get('page');
        if (component) {
            setActiveComponent(component);
        }
    }, [location.search]);

    // Update URL whenever active component changes
    useEffect(() => {
        if(activeComponent === 'Logout'){
            setIsAuthenticated(false);
            localStorage.removeItem('userLogin');
            localStorage.removeItem('userId');
            navigate('/');
        }
        else{
            navigate(`/myaccount?page=${activeComponent}`, { replace: false });
        }
    }, [activeComponent, navigate, setIsAuthenticated]);

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Orders':
                return <Orders setActiveComponent={setActiveComponent} />;
            case 'OrderDetails':
                return <OrderDetails setActiveComponent={setActiveComponent} />;
            case 'Favorites':
                return <Favorites setActiveComponent={setActiveComponent}/>;
            case 'CustomerSupport':
                return <CustomerSupport />;
            case 'Profile':
                return <Profile customerDetails={customerDetails} />;
            case 'Wallet':
                return <Wallet customerDetails={customerDetails} />;
            case 'Addresses':
                return <Addresses customerDetails={customerDetails} />;
            case 'ManageReferrals':
                return <Referrals />;
            case 'PasswordSettings':
                return <PasswordSettings customerDetails={customerDetails}/>;
            case 'Logout':
                setIsAuthenticated(false);
                localStorage.removeItem('userLogin');
                localStorage.removeItem('userId');
                return '/';
            default:
                return <Orders setActiveComponent={setActiveComponent} />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box>
                <Grid container sx={{ border: '2px solid #ececec', borderRadius: 3, p: 0 }}>
                    <Grid item xs={3} sm={3} md={4}>
                        <MyAccountSidebar
                            CustomerDetails={customerDetails}
                            setActiveComponent={setActiveComponent}
                        />
                    </Grid>
                    <Grid item xs={9} sm={9} md={8}>
                        {renderActiveComponent()}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default MyAccount;
