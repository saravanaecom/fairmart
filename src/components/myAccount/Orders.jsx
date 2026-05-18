/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import { ServerURL } from '../../server/serverUrl';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import { API_FetchMyOrders } from '../../services/userServices';
import ConfirmationPopup from '../modalPopup/confirmationPopup';
import NoImage from '../../assets/no-image.png';
import { useTheme } from '@mui/material/styles';

const OrderPendingSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="10 10 19 17"><rect width="38" height="38" fill="#FEECD2" rx="7"/><path fill="#EF6820" d="M25.389 25.174 19.145 9.91a.694.694 0 0 0-1.29 0L11.61 25.174a.694.694 0 0 0 .867.957l6.022-2.046 6.022 2.046c.073.01.148.01.222 0a.694.694 0 0 0 .506-.222.693.693 0 0 0 .139-.735Z"/></svg>
    )
};

const OrderAcceptedSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14"><rect width="14" height="14" fill="#EF6820" rx="7"/><path fill="#fff" d="M5.926 3.13a2.125 2.125 0 0 1 2.167 0 2.11 2.11 0 0 1 1.03 1.896v.096c.524 0 1.078.367 1.27 1.258l.32 2.496c.239 1.63-.708 2.292-1.978 2.292H5.28c-1.274 0-2.25-.458-1.987-2.292l.325-2.496c.05-.37.23-.716.508-.97.213-.188.488-.288.771-.288v-.096c-.033-.77.363-1.5 1.03-1.896Zm2.28 3.334a.368.368 0 0 0-.371.366c0 .2.167.367.37.367a.356.356 0 0 0 .259-.108.356.356 0 0 0 .108-.259.367.367 0 0 0-.367-.366Zm-2.417 0a.368.368 0 0 0-.371.366c0 .2.167.367.37.367a.367.367 0 0 0 0-.733ZM7 3.56a1.47 1.47 0 0 0-1.47 1.466v.092h2.945v-.092A1.47 1.47 0 0 0 7.001 3.56Z"/></svg>
    )
};

const OrderDeliveredSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14"><g clip-path="url(#clip0_640_2070)"><path fill="#06A976" d="M6.999 13.998A6.999 6.999 0 1 0 6.999 0a6.999 6.999 0 0 0 0 13.998Z" /><path fill="#fff" fill-rule="evenodd" d="M5.27 8.012 9.92 4.32a.73.73 0 0 1 .905 1.142l-5.28 4.191-.051.041a.732.732 0 0 1-.066.042l-.029.018a.728.728 0 0 1-.965-.285l-.082-.137-1.356-2.357a.726.726 0 0 1 1.26-.724l1.016 1.76H5.27Z" clip-rule="evenodd" /></g><defs><clipPath id="clip0_640_2070"><path fill="#fff" d="M0 0h14v14H0z" /></clipPath></defs></svg>
    )
};

const OrderCancelledSvg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14"><g clip-path="url(#clip0_640_2068)"><path fill="#A2AABA" d="M7 0C3.15 0 0 3.15 0 7s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7Zm2.59 8.61c.28.28.28.7 0 .98s-.7.28-.98 0L7 7.98 5.39 9.59c-.28.28-.7.28-.98 0a.677.677 0 0 1 0-.98L6.02 7 4.41 5.39a.677.677 0 0 1 0-.98c.28-.28.7-.28.98 0L7 6.02l1.61-1.61c.28-.28.7-.28.98 0s.28.7 0 .98L7.98 7l1.61 1.61Z" /></g><defs><clipPath id="clip0_640_2068"><path fill="#fff" d="M0 0h14v14H0z" /></clipPath></defs></svg>
    )
};

const Orders = ({ setActiveComponent }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [visibleOrders, setVisibleOrders] = useState(5);
    const [orderLists, setOrderLists] = useState([]);
    const [modalState, setModalState] = useState({
        confirmationModalOpen: false,
        orderId: 0,
      });

    const loadMoreOrders = () => {
        setVisibleOrders((prev) => prev + 5);
    };

    const FetchMyOrders = async (userId) => {
        try {
            const orderList = await API_FetchMyOrders(userId);
            setOrderLists(orderList);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching order lists:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        userId = Number(atob(userId));
        FetchMyOrders(userId);
        //setShowComponent(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleViewOrderDetails = (order, props) => {
        if(order.length !== 0){
            setActiveComponent(props);
            sessionStorage.setItem("OrderDetails", JSON.stringify(order));
        }
        else{
            setActiveComponent('');
            alert('');
        }
    };

    const handleOrderCancel = (event, order) => {
        event.stopPropagation();
        setModalState({
            ...modalState,
            confirmationModalOpen: true,
            orderId: order.Id,
          });      
    };
    
    const handleConfirmationAction = async(event) => {
        if (event.target.value === 'Yes') {
          if(modalState.orderId !== 0){
            
          }      
        }
        handleModalClose();
    };

    const handleModalClose = () => {
        setModalState({
          ...modalState,
          confirmationModalOpen: false,
          orderId: 0,
        });
    };
    
    return (
        <>
        <ConfirmationPopup
        ConfirmationModalOpen={modalState.confirmationModalOpen}
        handleConfirmationModalClose={handleModalClose}
        handleConfirmationClick={handleConfirmationAction}
      />
            <Box sx={{ background: '#f0f4f9', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
                {/* Check if orderLists.OrderDetails is defined and is an array */}
                {orderLists && Array.isArray(orderLists) && orderLists.length > 0 ? (
                    orderLists.map((order, index) => (
                        <Paper onClick={() => handleViewOrderDetails(order, 'OrderDetails')} key={index} sx={{ my: 2, boxShadow: '0 0 #0000, 0 0 #0000, 0px 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1)', borderRadius: '1rem', cursor: 'pointer' }}>
                            <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <img src={order.Img0 ? ImagePathRoutes.ProductImagePath + order.Img0 : NoImage}
                                        style={{ width: '50px', height: '50px', borderRadius: '.5rem', objectFit: 'contain' }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                                    <Box><Typography sx={{ textAlign: 'left', fontSize: 18, fontWeight: 500, cursor: 'pointer' }}>View<KeyboardArrowRightIcon size="small" sx={{ width: '18px', height: '18px', fontWeight: 600 }} /></Typography></Box>
                                    {/* <Box onClick={(event) => handleOrderCancel(event, order)}><Typography sx={{ color: 'red', textAlign: 'left', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>Cancel<CloseIcon size="small" sx={{ width: '18px', height: '18px', fontWeight: 600 }} /></Typography></Box> */}
                                </Box>                                
                            </Box>
                            <Box sx={{ mb: 2, p: 2, pt: 0, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" sx={{ textAlign: 'left', fontSize: 16, fontWeight: 600, }}>Order {order.orderstatus}</Typography>
                                        <Box sx={{ ml: 1 }}>
                                            {order.orderstatus === 'Pending' ? <OrderPendingSvg/> 
                                            : order.orderstatus === "Accepted" ? <OrderAcceptedSvg/>
                                            : order.orderstatus === "Delivered" ? <OrderDeliveredSvg/>
                                            : order.orderstatus === "Cancel" ? <OrderCancelledSvg/> : ''}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', fontSize: 14, fontWeight: 500, }}>
                                        Placed at {order.OrderDate.split('T')[0]}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ textAlign: 'left', fontSize: 16, fontWeight: 600, }}>
                                    {order.Grossamt.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </Paper>
                    ))
                ) : (
                    <Typography sx={{color: theme.palette.lightblackcolorCode.main}}>No orders found.</Typography>
                )}
                {visibleOrders < orderLists.length && (
                    <Button variant="contained" onClick={loadMoreOrders} sx={{ mt: 2, background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main }}>
                        Load More Orders
                    </Button>
                )}
            </Box>

        </>
    );
};

export default Orders;
