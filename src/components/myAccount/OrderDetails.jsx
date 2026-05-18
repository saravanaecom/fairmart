/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import { ServerURL } from '../../server/serverUrl';
import { ImagePathRoutes } from '../../routes/ImagePathRoutes';
import ConfirmationPopup from '../modalPopup/confirmationPopup';
import NotifyApp from '../AlertNotification';
import CircularLoader from '../circular-loader';
import NoImage from '../../assets/no-image.png';
import {API_CancelMyOrder} from '../../services/userServices';
import { useTheme } from '@mui/material/styles';

const OrderDetails = ({ setActiveComponent }) => {
  const theme = useTheme();
  const [OrderIdDetail, setOrderIdDetails] = useState([]);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalSalePrice, setTotalSalePrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [cancelBtn, setCancelBtn] = useState(false);
  const [showNotify, setshowNotify] = useState(false);
  const [showNotifyError, setshowNotifyError] = useState('success');
  const [showNotifyMsg, setshowNotifyMsg] = useState('');
  const [showLoader, setShowLoader] = React.useState(false);
  const [modalState, setModalState] = useState({
    confirmationModalOpen: false,
    orderId: 0,
  });


  useEffect(() => {
    let order = JSON.parse(sessionStorage.getItem("OrderDetails"));
    setOrderIdDetails(order);

    if (order?.OrderDetails && Array.isArray(order.OrderDetails) && order.OrderDetails.length > 0) {
      // Calculate total MRP and Sale Price, ensuring values are numeric
      const mrp = order.OrderDetails.reduce((acc, item) => {
        const validMRP = parseFloat(item.MRP) || 0; // Ensure MRP is numeric
        const validQuantity = parseInt(item.ItemQty) || 1; // Default Quantity to 1 if missing
        return acc + (validMRP * validQuantity);
      }, 0);

      const salePrice = order.OrderDetails.reduce((acc, item) => {
        const validPrice = parseFloat(item.Price) || 0; // Ensure Price is numeric
        const validQuantity = parseInt(item.ItemQty) || 1; // Default Quantity to 1 if missing
        return acc + (validPrice * validQuantity);
      }, 0);      

      // Update total MRP and Sale Price
      setTotalMRP(prevMRP => prevMRP + mrp);
      setTotalSalePrice(salePrice);
    }
  }, []);

  
  useEffect(() => {
    console.log("totalsalePrice", totalMRP, totalSalePrice);
    if (totalMRP > 0 && totalSalePrice > 0) {
      setTotalSavings(totalMRP - totalSalePrice);
    }
  }, [totalMRP, totalSalePrice]);

 

  const OrderPendingSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="10 10 19 17"><rect width="38" height="38" fill="#FEECD2" rx="7" /><path fill="#EF6820" d="M25.389 25.174 19.145 9.91a.694.694 0 0 0-1.29 0L11.61 25.174a.694.694 0 0 0 .867.957l6.022-2.046 6.022 2.046c.073.01.148.01.222 0a.694.694 0 0 0 .506-.222.693.693 0 0 0 .139-.735Z" /></svg>
    )
  };

  const OrderAcceptedSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14"><rect width="14" height="14" fill="#EF6820" rx="7" /><path fill="#fff" d="M5.926 3.13a2.125 2.125 0 0 1 2.167 0 2.11 2.11 0 0 1 1.03 1.896v.096c.524 0 1.078.367 1.27 1.258l.32 2.496c.239 1.63-.708 2.292-1.978 2.292H5.28c-1.274 0-2.25-.458-1.987-2.292l.325-2.496c.05-.37.23-.716.508-.97.213-.188.488-.288.771-.288v-.096c-.033-.77.363-1.5 1.03-1.896Zm2.28 3.334a.368.368 0 0 0-.371.366c0 .2.167.367.37.367a.356.356 0 0 0 .259-.108.356.356 0 0 0 .108-.259.367.367 0 0 0-.367-.366Zm-2.417 0a.368.368 0 0 0-.371.366c0 .2.167.367.37.367a.367.367 0 0 0 0-.733ZM7 3.56a1.47 1.47 0 0 0-1.47 1.466v.092h2.945v-.092A1.47 1.47 0 0 0 7.001 3.56Z" /></svg>
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

  const handleOrderCancel = (event, OrderIdDetail) => {
      event.stopPropagation();
      setModalState({
          ...modalState,
          confirmationModalOpen: true,
          orderId: Number(OrderIdDetail.Id),
        });      
  };

  const handleConfirmationAction = async(event) => {
      if (event.target.value === 'Yes') {
        if(modalState.orderId !== 0){  
          handleModalClose();     
          setShowLoader(true);   
          try {
            const response = await API_CancelMyOrder(modalState.orderId);
            if(response){
              setCancelBtn(true);
              setShowLoader(false);
              setshowNotifyMsg('Your order has been cancelled');
              setshowNotifyError('success');
              setshowNotify(true);
            }
            else{
              setshowNotify(true);
              setShowLoader(false);
              setshowNotifyError('error');
              setshowNotifyMsg('Your order has been cancel failed');
            }
          } catch (error) {
            setshowNotify(true);
            setShowLoader(false);
            setshowNotifyError('error');
            setshowNotifyMsg('Your order has been cancel failed');
            console.error("Error cancel order:", error);
          }
        }    
        else{
          handleModalClose();
          setshowNotify(true);
          setShowLoader(false);
          setshowNotifyError('error');
          setshowNotifyMsg('Your order has been cancel failed');
        }  
      } 
      else{
        handleModalClose();
      }       
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
      <CircularLoader showLoader={showLoader} />
      <ConfirmationPopup
        ConfirmationModalOpen={modalState.confirmationModalOpen}
        handleConfirmationModalClose={handleModalClose}
        handleConfirmationClick={handleConfirmationAction}
      />
      <NotifyApp showNotify={showNotify} showNotifyMsg={showNotifyMsg} showNotifyError={showNotifyError}/>
      {OrderIdDetail.length !== 0 && (
        <Box sx={{ background: '#f0f4f9', maxHeight: '700px', overflowY: 'scroll', borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ backgroundColor: '#FFF', py: 2, px: 2, borderBottom: '1px solid #ececec' }} display="flex" justifyContent="space-between" alignItems="center">
            <Button onClick={() => setActiveComponent('Orders')} startIcon={<ArrowBackIosIcon />} sx={{ color: '#000', fontWeight: 500 }}>Back</Button>
            <Button>
              Order Id #{OrderIdDetail.Id}
            </Button>
          </Box>

          {/* Order Status */}
          <Box sx={{ backgroundColor: '#FFF', py: 2, px: 2, borderBottom: '1px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <CancelIcon sx={{ fontSize: 20, color: '#f44336' }} /> */}
            
            <Box ml={1} display='flex' alignItems='center' justifyContent='space-between'>
              {OrderIdDetail.orderstatus === 'Pending' ? <OrderPendingSvg />
                : OrderIdDetail.orderstatus === "Accepted" ? <OrderAcceptedSvg />
                  : OrderIdDetail.orderstatus === "Delivered" ? <OrderDeliveredSvg />
                    : OrderIdDetail.orderstatus === "Cancel" ? <OrderCancelledSvg /> : ''}
                <Typography variant="p" fontWeight="600" sx={{ fontSize: 18 }}>
                  {OrderIdDetail.OrderDetails ? OrderIdDetail.OrderDetails.length : 0} item{OrderIdDetail.OrderDetails && OrderIdDetail.OrderDetails.length !== 1 ? 's' : ''}  {OrderIdDetail.orderstatus}
                </Typography>             
            </Box>
              <Box sx={{display: 'none'}}>
                <Button disabled={cancelBtn || OrderIdDetail.orderstatus === "Cancel" ? true : false} onClick={(event) => handleOrderCancel(event, OrderIdDetail)} size='small' sx={{ px: 1, background: '#FFF', color: 'red', border: '1px solid red'}}>Cancel<CloseIcon size="small" sx={{ width: '18px', height: '18px', fontWeight: 600 }} /></Button>
              </Box>
          </Box>

          {/* Order Items */}
          <Box sx={{ backgroundColor: '#FFF', py: 2, px: 2 }}>
            <Typography align="left" variant="body1" fontWeight="bold">{OrderIdDetail.OrderDetails ? OrderIdDetail.OrderDetails.length : 0} item{OrderIdDetail.OrderDetails && OrderIdDetail.OrderDetails.length !== 1 ? 's' : ''} in order</Typography>
            <List>
              {OrderIdDetail.OrderDetails && Array.isArray(OrderIdDetail.OrderDetails) && OrderIdDetail.OrderDetails.length > 0 ? (
                OrderIdDetail.OrderDetails.map((lists, index) => (
                  <ListItem disableGutters key={index}>
                    <ListItemAvatar>
                      <Avatar
                        src={lists.Img0 ? ImagePathRoutes.ProductImagePath + lists.Img0 : NoImage}
                        alt={lists.ProductName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={lists.ProductName}
                      secondary={`${lists.ItemQty} piece${lists.ItemQty > 1 ? 's' : ''} - 1 unit`}
                    />
                    <Typography variant="body2" align="right">
                      <Typography sx={{ fontSize: 14 }} variant="span">{lists.SaleRate.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography><br />
                      <Typography sx={{ textDecoration: 'line-through', color: '#a3a4ae', fontSize: 12 }} variant="span">
                          {'MRP:' + lists.MRP.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <ListItem>No items available</ListItem>
              )}

            </List>
          </Box>

          {/* Bill Summary */}
          <Box sx={{ backgroundColor: '#FFF', py: 2, px: 2, my: 1.5, boxShadow: '0 0 #0000, 0 0 #0000, 0px 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.1)' }}>
            <Typography align='left' variant="h6" gutterBottom>
              Bill Summary
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#262a33', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Total Amount</Typography>
              <Typography variant="body2">{OrderIdDetail.Grossamt ? OrderIdDetail.Grossamt.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>
            <Box display="none" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#262a33', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Handling Charge</Typography>
              <Typography variant="body2">{OrderIdDetail.HandlingCharge ? OrderIdDetail.HandlingCharge.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>
            <Box display="none" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#000', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Convenience Fee</Typography>
              <Typography variant="body2">{OrderIdDetail.ConvenienceFee ? OrderIdDetail.ConvenienceFee.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>
            <Box display="none" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#000', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Delivery Fee</Typography>
              <Typography variant="body2">{OrderIdDetail.DeliveryFees ? OrderIdDetail.DeliveryFees.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>            
            <Box sx={{ borderBottom: '1px solid #ececec', pb: 1 }} display="none" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#000', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Wallet Amount</Typography>
              <Typography variant="body2">{OrderIdDetail.WalletAmount ? OrderIdDetail.WalletAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" my={1}>
              <Typography variant="body2" sx={{ color: '#000', fontSize: '12px', fontWeight: 450, borderBottom: 'dashed 1px lightgray', display: 'inline' }}>Total Savings</Typography>
              <Typography variant="body2">{(totalMRP - OrderIdDetail.Grossamt) ? (totalMRP - OrderIdDetail.Grossamt).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
            </Box>
            <Box display="flex" mt={2} justifyContent="space-between">
              <Typography align='left' gutterBottom variant="body1" fontWeight="bold">Total Bill
                <Typography sx={{ color: 'grey', fontWeight: 500, fontSize: '12px' }}>Incl. all taxes and charges</Typography>
              </Typography>
              <Box align='right'>
                <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'grey', fontSize: 14 }}>{'MRP:' + OrderIdDetail.Grossamt.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">{OrderIdDetail.Grossamt ? OrderIdDetail.Grossamt.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
                <Typography variant="caption" color="success.main"
                  sx={{
                    color: theme.palette.basecolorCode.main || '#3BB77E',
                    padding: '2px 6px',
                    background: 'linear-gradient(45deg, rgba(34, 155, 82, 0.18), rgba(34, 155, 82, 0))'
                  }}>SAVED {(totalMRP - OrderIdDetail.Grossamt) ? (totalMRP - OrderIdDetail.Grossamt).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₹0.00'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Order Details */}
          <Box sx={{ backgroundColor: '#FFF', py: 2, px: 2 }} align='left'>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight="bold" gutterBottom>Order Details</Typography>
              <Box sx={{ display: 'none' }} mt={2}>
                <Button size="small" sx={{ background: theme.palette.shadowcolorCode.main, color: theme.palette.basecolorCode.main, border: '0.1px solid', borderColor: theme.palette.lightblackcolorCode.main || '#3BB77E', borderRadius: 0 }}>
                  Download Invoice
                </Button>
              </Box>
            </Box>
            <Box>
              {/* Order ID */}
              <Typography variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Order ID:</Typography>
                {ServerURL.COMPANY_REF_ID + ' ' + btoa(OrderIdDetail.OrderNo)}
              </Typography>

              {/* Delivery Address */}
              <Typography my={1} variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Delivery Address:</Typography>
                {OrderIdDetail.Address1}
                {OrderIdDetail.Address2 ? `, ${OrderIdDetail.Address2}` : ""}
                {`, ${OrderIdDetail.City}-${OrderIdDetail.Pincode}`}
                {OrderIdDetail.LandMark ? `, ${OrderIdDetail.LandMark}` : ""}
              </Typography>

              {/* Order Placed */}
              <Typography my={1} variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Order Placed:</Typography>
                {OrderIdDetail.OrderDate.split('T')[0]}
              </Typography>

              {/* OrderType */}
              <Typography my={1} variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Order type:</Typography>
                {OrderIdDetail.OrderType}
              </Typography>

              {/* DeliveryType */}
              <Typography my={1} variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Delivery type:</Typography>
                {OrderIdDetail.DeliveryType}
              </Typography>

              {/* DeliveryDate */}
              <Typography my={1} variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Delivery date:</Typography>
                {OrderIdDetail.DeliveryDate.split('T')[0]}
              </Typography>

              {/* Delivery time */}
              <Typography variant="body2">
                <Typography gutterBottom style={{ color: theme.palette.lightblackcolorCode.main || 'grey', fontWeight: 500, fontSize: '12px', margin: 0 }}>Delivery time:</Typography>
                {OrderIdDetail.DeliveryTime}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default OrderDetails;
