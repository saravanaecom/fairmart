/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Box, Typography, Grid ,TextField,Button} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SmsIcon from '@mui/icons-material/Sms';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useCart } from '../../context/CartContext';
import { ServerURL } from '../../server/serverUrl';
import { FetchCoupons,Fetchsalecoupon } from '../../services/checkoutServices';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderTop: `1px solid #f0f4f9`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: '#FFF',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(0),
    alignItems: 'center'
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '0px solid #f0f4f9',
}));

export default function AccordionAmountDetails({ useWallet, walletAmount }) {
  const { cartItems } = useCart();
  const [expanded, setExpanded] = React.useState('panel1');
  const [MRPAmount, setMRPAmount] = React.useState(0);
  const [SavingsAmount, setSavingsAmount] = React.useState(0);
  const [TotalPrice, setTotalPrice] = React.useState(0);
  const [ExtraDiscount, setExtraDiscount] = React.useState(0);
  const [HandlingCharge, setHandlingCharge] = React.useState(0);
  const [DeliveryFee, setDeliveryFee] = React.useState(0);
  const [CouponDiscount,setCouponDiscount]=React.useState(0);
  const [CouponDiscountdata,setCouponDiscountData]=React.useState(null);
  const [NetAmount,setNetAmount]=React.useState(0);
  const [couponCode, setCouponCode] =React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [discountValue, setDiscountValue] = React.useState(0);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [appliedCoupon, setAppliedCoupon] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalMRP = cartItems.reduce((acc, item) => acc + (item.totalMRP > 0 ? item.totalMRP : item.MRP), 0);
      const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

      setMRPAmount(totalMRP);
      setTotalPrice(useWallet ? totalPrice - walletAmount : totalPrice);
      setSavingsAmount(totalMRP - totalPrice);
    }
  }, [cartItems, useWallet, walletAmount]);

  useEffect(() => {
    const storedDiscount = localStorage.getItem('DiscountData');
    if (storedDiscount) {
      setAppliedCoupon(true);
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }

    if (appliedCoupon) {
      console.log('Coupon already applied.');
      return;
    }

    const objlist = {
      Comid: ServerURL.COMPANY_REF_ID,
      CustomerRefId: Number(atob(localStorage.getItem("userId"))),
      code: couponCode,
    };

    setLoading(true);

    try {
      const response = await FetchCoupons(objlist);
      if (!response || response.length === 0) {
        setCouponDiscountData(null);
        return;
      }

      localStorage.setItem('DiscountData', JSON.stringify(response));
      const couponData = response[0];
      const expiresAt = new Date(couponData.expiresAt);
      const currentDate = new Date();

      if (currentDate > expiresAt) {
        console.log('Coupon has expired.');
        setCouponDiscountData(null);
        return;
      }

      const objdata = {
        Comid: ServerURL.COMPANY_REF_ID,
        CustomerRefId: Number(atob(localStorage.getItem("userId"))),
        CouponRefId: couponData.Id,
      };

      const count = await Fetchsalecoupon(objdata);
      const applyCouponAmount = (amount, couponType, couponValue) => {
        localStorage.setItem('discountAmount', JSON.stringify(amount));
        setDiscountAmount(amount);
        setCouponDiscountData({ type: couponType, value: couponValue });
        setTotalPrice((prevPrice) => Math.max(0, prevPrice - amount));
        setAppliedCoupon(true);
      };

      if (count === 0 && couponData.isMultipleTimesOffer === 0) {
        if (couponData.coupondiscount) {
          const discountPercent = parseFloat(couponData.coupondiscount);
          if (!isNaN(discountPercent)) {
            const discountAmountValue = (discountPercent / 100) * TotalPrice;
            applyCouponAmount(discountAmountValue, 'percent', couponData.coupondiscount);
          }
        } else if (couponData.discountValue) {
          const discountValue = parseFloat(couponData.discountValue);
          if (!isNaN(discountValue)) {
            setDiscountValue(discountValue);
            applyCouponAmount(discountValue, 'value', couponData.discountValue);
          }
        } else {
          setCouponDiscountData(null);
        }
      } else if (count > 0 && couponData.isMultipleTimesOffer === 0) {
        console.log('Coupon has already been applied.');
        setCouponDiscountData(null);
      } else if (couponData.isMultipleTimesOffer === 1) {
        if (couponData.coupondiscount) {
          const discountPercent = parseFloat(couponData.coupondiscount);
          if (!isNaN(discountPercent)) {
            const discountAmountValue = (discountPercent / 100) * TotalPrice;
            applyCouponAmount(discountAmountValue, 'percent', couponData.coupondiscount);
          }
        } else if (couponData.discountValue) {
          const discountValue = parseFloat(couponData.discountValue);
          if (!isNaN(discountValue)) {
            setDiscountValue(discountValue);
            applyCouponAmount(discountValue, 'value', couponData.discountValue);
          }
        } else {
          setCouponDiscountData(null);
        }
      } else {
        setCouponDiscountData(null);
      }
    } catch (error) {
      console.error('Failed to apply the coupon', error);
      setCouponDiscountData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Accordion sx={{display: 'none'}} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <VolunteerActivismIcon sx={{ marginRight: '15px', color: '#5c5c5c' }} />
          <Typography sx={{ color: '#262a33', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>Delivery partner tip
            <Typography sx={{ fontSize: '.75rem', lineHeight: '1rem', fontWeight: 400, fontFamily: 'inherit' }}>This amount goes to your delivery partner</Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontSize: '14px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{display: 'none'}} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <SmsIcon sx={{ marginRight: '15px', color: '#5c5c5c' }} />
          <Typography sx={{ color: '#262a33', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>Delivery instructions
            <Typography sx={{ fontSize: '.75rem', lineHeight: '1rem', fontWeight: 400, fontFamily: 'inherit' }}>Delivery partner will be notified</Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontSize: '14px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{p: 0}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ marginRight: '15px', color: '#5c5c5c' }} />
              <Box>
                <Typography sx={{ color: '#262a33', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>To pay</Typography>
                <Typography variant="body2" sx={{ color: '#a3a4ae', fontSize: '12px', fontWeight: 400, fontFamily: 'inherit' }}>
                  Incl. all taxes and charges
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="p"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#a3a4ae',
                    marginRight: '8px',
                    fontSize: '12px'
                  }}
                >
                  {MRPAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '12px', color: '#253D4E' }}>
                  {TotalPrice.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Typography
                variant="p"
                sx={{
                  background: 'linear-gradient(290deg, rgba(34, 155, 82, 0.18), rgba(34, 155, 82, 0))',
                  color: '#229b52',
                  fontWeight: '600',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  display: 'inline-block',
                  fontSize: '10px',
                }}
              >
                {'SAVINGS' + SavingsAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{pt: 0}}>
          <Box sx={{ width: '100%' }}>
            <Grid container>
              <Grid item xs={8} sx={{mt: 0.5}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">MRP Total Amount</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5}}>
                <Typography sx={{ fontSize: '14px' }} variant="body1" align="right">
                {MRPAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={8} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">Extra discount</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px' }} variant="body1" align="right" color="green">
                {ExtraDiscount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>
              <Grid item xs={8} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">Handling charge</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px' }} variant="body1" align="right">
                {HandlingCharge.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={8} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">Delivery fee:</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5, display: 'none'}}>
                <Typography sx={{ fontSize: '14px' }} variant="body1" align="right">
                {DeliveryFee.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={8} sx={{mt: 0.5}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">Today Savings</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5}}>
                <Typography sx={{ fontSize: '14px' }} variant="body1" align="right" color="green">
                  <span></span>
                {SavingsAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={8} sx={{mt: 0.5}}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">Total Amount</Typography>
              </Grid>
              <Grid item xs={4} sx={{mt: 0.5}}>                
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }} variant="body1" align="right">
                  {(TotalPrice + DeliveryFee + HandlingCharge - ExtraDiscount).toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={8} sx={{ mt: 0.5 }}>
                <Typography sx={{ fontSize: '14px', borderBottom: 'dashed 1px lightgray', display: 'inline' }} variant="body1">
                  Discount Applied
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ mt: 0.5 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }} variant="body1" align="right">
                  {CouponDiscountdata?.type === 'percent' && discountAmount > 0 ? (
                    discountAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  ) : CouponDiscountdata?.type === 'value' && discountValue > 0 ? (
                    discountValue.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  ) : (
                    0
                  )}
                </Typography>
              </Grid>

              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography 
                    variant="body1" 
                    sx={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Offer Coupon
                  </Typography>
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    size="small"
                    onClick={handleApplyCoupon}
                    disabled={appliedCoupon || loading}
                  >
                    {appliedCoupon ? 'Applied' : 'Apply'}
                  </Button>
                </Grid>

                {CouponDiscountdata && CouponDiscountdata.value && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography 
                      sx={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: 'green' 
                      }}
                    >
                      Coupon Applied: 
                      {CouponDiscountdata.type === 'percent'
                        ? `${CouponDiscountdata.value}% off`
                        : `${CouponDiscountdata.value} RS off`}  
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
