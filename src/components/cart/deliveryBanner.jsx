import React, {useEffect} from 'react';
import { Box, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; 
import { useCart } from '../../context/CartContext';
import { ServerURL } from '../../server/serverUrl';
import { useTheme } from '@mui/material/styles';

const DeliveryBanner = () => {
  const theme = useTheme();
  const { cartItems } = useCart();
  const [SavingsAmount, setSavingsAmount] = React.useState(0);
  const [DeliveryFee, setDeliveryFee] = React.useState(0);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalMRP = cartItems.reduce((acc, item) => acc + item.totalMRP, 0);
      const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  
      setSavingsAmount(totalMRP - totalPrice);
      setDeliveryFee(0);
    }
  }, [cartItems]);
  return (
    <Box
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.shadowcolorCode.main} 0%, ${theme.palette.shadowcolorCode.main} 100%)`,
        padding: '7px 20px',
        color: theme.palette.whitecolorCode.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      }}
    >      
      <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.basecolorCode.main }}>
        <LocalOfferIcon size="small" sx={{ marginRight: 1, fontSize: '14px' }} />
        <Typography variant="span" sx={{ fontWeight: 'bold', marginRight: 1, fontSize: '12px' }}>
        {SavingsAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })} saved!
        </Typography>
        <Typography variant="span" sx={{ marginRight: 1, color: '#000', fontSize: '12px', display: 'none' }}>
          Your delivery fee on<Typography variant="span" sx={{ fontWeight: 'bold', color: theme.palette.basecolorCode.main}}> {DeliveryFee.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
        </Typography>        
      </Box>
    </Box>
  );
};

export default DeliveryBanner;
