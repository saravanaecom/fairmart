/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link, Modal, Container, TextField, Button, CircularProgress, Typography, Grid, Box, Paper, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../context/CartContext';
import { ServerURL } from '../server/serverUrl';
import { ImagePathRoutes } from '../routes/ImagePathRoutes';
import Calendar from '../components/datePicker';
import { API_FetchDeliveryTimes,API_FetchSelectSettingsNew,API_Fetchpincode,API_Fetchdeliverycharges } from '../services/settings';
import { API_InsertSaleOrderSave } from '../services/checkoutServices';
import { useTheme } from '@mui/material/styles';
import CircularLoader from '../components/circular-loader';
import OrderSuccess from '../assets/success.gif';
import OrderInfo from '../assets/information.gif';
import AddressChangeModal from '../components/cart/addressChangeModal';
import RazorpayPayment from '../components/RazorpayPayment';
import { API_FetchCustomerAddress } from '../services/userServices';
import dayjs from 'dayjs';
import { getDistance } from 'geolib';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '100%', sm: '100%', md: 280, lg: 300, xl: 300},
    bgcolor: 'background.paper',
    py: 2,
    borderRadius: 1
};

export default function ProductCheckout() {
    const { cartItems, setCartItems } = useCart();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [UserId, setUserId] = React.useState(0);
    const [ModalOpen, setModalOpen] = React.useState(false);
    const [MRPAmount, setMRPAmount] = React.useState(0);
    const [SavingsAmount, setSavingsAmount] = React.useState(0);
    const [TotalPrice, setTotalPrice] = React.useState(0);
    const [originalTotalPrice, setOriginalTotalPrice] = React.useState(0);
    const [ExtraDiscount, setExtraDiscount] = React.useState(0);
    const [HandlingCharge, setHandlingCharge] = React.useState(0);
    const [DeliveryFee, setDeliveryFee] = React.useState(0);
    const [pincodedata,setPincodedata] = React.useState([]);
    const [walletAmount, setwalletAmount] = React.useState(0);
    const [DeliveryTimeList, setDeliveryTimeList] = React.useState([]);
    const [whatsapdata, setwhatsapdata] = React.useState([]);
    
    const [DateValue, setDateValue] = React.useState(dayjs());
    const [DeliverytimeId, setDeliverytimeId] = React.useState(0);
    const [Deliverytime, setDeliverytime] = React.useState('');
    const [PaymentType, setPaymentType] = React.useState('');
    const [OnlinePayment, setOnlinePayment] = React.useState(false);
    const [DeliveryType, setDeliveryType] = React.useState('Delivery');
    const [DeliveryTypeState, setDeliveryTypeState] = React.useState(true);
    const [selectedAddress, setSelectedAddress] = React.useState('');
    const [InfoStatus, setInfoStatus] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showLoader, setShowLoader] = React.useState(false);
    const [couponId, setCouponId] = React.useState(0);
    const [couponDiscount, setCouponDiscount] =React.useState(0); 
    const [discountAmount, setDiscountAmount] = React.useState(0);
    const [pincodes, setPincodes] = React.useState([]);
    const [AlertOpen, setAlertOpen] = React.useState(false);
    const handleAlertOpen = () => setAlertOpen(true);
    const [adminlatitude, setAdminlatitude] = React.useState('');
    const [adminLangitude, setAdminLangitude] = React.useState('');
    const  [COD ,setCod]= React.useState(ServerURL.COD);
    const [userlatitude, setUserlatitude] = React.useState('');
    const [userLangitude, setuserLangitude] = React.useState('');
    const [distance, setDistance] =  React.useState(0);
    const [deliverychargelist,  setDeliverychargelist] = React.useState([]);
    const [deliverycharge,  setDeliveryCharge] = React.useState([]);
    const [customerDetails, setCustomerDetails] = React.useState(null);
    const [gstNumber, setGstNumber] =React.useState(null);
    const handleAlertClose = () => {
        if (InfoStatus === 'Your order has been placed') {
            navigate('/');
        }
        setAlertOpen(false);
    };

    const address = selectedAddress || {};
    const totalPayable = Number(TotalPrice) + Number(deliverycharge) + Number(HandlingCharge) - Number(ExtraDiscount);
    const formattedTotalPayable = totalPayable.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleChangeAddress = () => {
        let userLogin = localStorage.getItem("userLogin");
        let userId = Number(atob(localStorage.getItem("userId")));
        if (userLogin === null) {
            setUserId(0);
            setModalOpen(false);
        }
        else if(userLogin === "false" || userId === 0){
            setUserId(0);
            setModalOpen(false);
        }
        else{
          setUserId(userId);
          setModalOpen(true);
        }
    };


    useEffect(() => {
        const fetchUserData = async () => {
            let storedUserId = localStorage.getItem("userId");

            if (storedUserId) {
                try {
                    storedUserId = decodeURIComponent(storedUserId);
                    let numericUserId = Number(atob(storedUserId));

                    if (!isNaN(numericUserId)) {
                        setUserId(numericUserId);

                        // Fetch customer address only if userId is valid
                        try {
                            const address = await API_FetchCustomerAddress(numericUserId);
                            if (Array.isArray(address) && address.length > 0) {
                                const firstCustomer = address[0];
                                setCustomerDetails(firstCustomer);
                                setGstNumber(firstCustomer.GSTNo || null);
                           
                            }

                            console.log("Fetched Address:", address);
                        } catch (error) {
                            console.error("Error fetching customer address:", error);
                        }
                    } else {
                        console.error("Decoded value is not a valid number");
                    }
                } catch (error) {
                    console.error("Error decoding userId:", error);
                }
            } else {
                console.log("No userId found in localStorage");
            }
        };

        fetchUserData();
    }, []);

    const handleChangeAddressClose = () => {
        setModalOpen(false);
        let address = JSON.parse(sessionStorage.getItem('selectedAddress'));
        setSelectedAddress(address);
    };

    //Load delivery time lists
    const FetchDeliveryTimes = async () => {
        try {
            const list = await API_FetchDeliveryTimes();
            setDeliveryTimeList(list);
        } catch (error) {
            setDeliveryTimeList([]);
            console.error('Error fetching categories:', error);
        }
    };
    const FetchSelectSettingsNew = async () => {
        try {


            const list = await API_FetchSelectSettingsNew();
      
    
            if (Array.isArray(list) && list.length > 0) {
                setwhatsapdata(list);
                const firstItem = list[0];
                setAdminlatitude(firstItem.Latitude);
                console.log(adminlatitude)
                setAdminLangitude(firstItem.Longitude);
                  console.log(adminLangitude)
                  setCod(firstItem.COD)
                
            } else {
                console.error("Fetched data is not a valid array or is empty.");
                setwhatsapdata([]); 
            }
        } catch (error) {
            setwhatsapdata([]);
            console.error("Error fetching categories:", error);
        }
    };
    
             
    const handleCalculateDistance = React.useCallback(() => {
        if (!selectedAddress || !selectedAddress.Latitude || !selectedAddress.Langitude || !adminlatitude || !adminLangitude) {
            setDistance(0);
            return;
        }
     
        setUserlatitude(selectedAddress.Latitude);
        setuserLangitude( selectedAddress.Langitude);
        const dist = getDistance(
          { latitude: selectedAddress.Latitude, longitude: selectedAddress.Langitude },
          { latitude:adminlatitude,longitude:adminLangitude }
        );
        const distInKilometers = dist / 1000;
        setDistance(distInKilometers);
        console.log(distInKilometers); 
      }, [selectedAddress, adminlatitude, adminLangitude]);


 const handlefetchdeliverycharges = async()=>{

    try {
        
        const list = await API_Fetchdeliverycharges();
        if (Array.isArray(list) && list.length > 0) {
          
            setDeliverychargelist(list);
            
        } else {
            console.error("Fetched data is not a valid array or is empty.");
 
        }

    } catch (error) {

        setDeliverychargelist([]);
        console.error("Error fetching categories:", error);
        
    }
      }
        const findDeliveryCharge = React.useCallback(() => {
        const chargeData = deliverychargelist.find(item => 
            distance >= item.StartKM && distance <= item.EndKM
        );
    
        if (chargeData) {
            setDeliveryCharge(chargeData.DeliveryCharges);
            console.log(`Delivery Charge: ${chargeData.DeliveryCharges}`);
        } else {
            setDeliveryCharge(0);
            console.log("No matching range found.");
        }
    }, [deliverychargelist, distance]);
    
    // Example: setting distance to 11 and finding delivery charge
    React.useEffect(() => {
        findDeliveryCharge();
    }, [distance, findDeliveryCharge]); 

    const FetchPincode = async () => {
        try {
            const list = await API_Fetchpincode();
            if (Array.isArray(list) && list.length > 0) {
                const extractedPincodes = list.map(item => item.pincode);
                setPincodes(extractedPincodes);
                console.log(pincodes);
                setPincodedata(list); 
        console.log(pincodedata)
            } else {
                console.error("Fetched data is not a valid array or is empty.");
                setPincodedata([]); 
            }
        } catch (error) {
            setPincodedata([]);
            console.error("Error fetching categories:", error);
        } 
    };
    useEffect(() => {
        FetchDeliveryTimes();
        FetchSelectSettingsNew();
        FetchPincode();
        handlefetchdeliverycharges();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
     



    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodedWalletAmount = queryParams.get('Wallet');
        let amt = atob(encodedWalletAmount);
        // setwalletAmount(Number(amt));
    
        let address = JSON.parse(sessionStorage.getItem('selectedAddress'));
        setSelectedAddress(address); 
    
    }, [location.search]); 
    

    useEffect(() => {
        if (selectedAddress) {
            handleCalculateDistance();
        }
    }, [selectedAddress, adminlatitude, adminLangitude, handleCalculateDistance]);
    
    useEffect(() => {
        if (cartItems.length > 0) {
            const totalMRP = cartItems.reduce((acc, item) => acc + item.totalMRP, 0);
            const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
            
            setMRPAmount(totalMRP);
            setOriginalTotalPrice(totalPrice);
            setSavingsAmount(totalMRP - totalPrice);

            let updatedPrice = totalPrice;
            const useWallet = localStorage.getItem('UseWallet');
            if (useWallet && walletAmount) {
                updatedPrice = Math.max(0, updatedPrice - walletAmount);
            }

            let DiscountData = localStorage.getItem("DiscountData");
            if (DiscountData) {
                try {
                    const parsedData = JSON.parse(DiscountData);
                    const couponData = Array.isArray(parsedData) ? parsedData[0] : parsedData;
                    
                    if (couponData?.Id) {
                        setCouponId(couponData.Id); 
                    }

                    if (couponData?.coupondiscount) {
                        const discountPercent = parseFloat(couponData.coupondiscount.replace('%', ''));
                        if (!isNaN(discountPercent)) {
                            setCouponDiscount(discountPercent);
                            const discountAmount = (discountPercent / 100) * updatedPrice;
                            setDiscountAmount(discountAmount);
                            updatedPrice = Math.max(0, updatedPrice - discountAmount);
                        }
                    } else if (couponData?.discountValue) {
                        const discountValue = parseFloat(couponData.discountValue);
                        if (!isNaN(discountValue)) {
                            setCouponDiscount(0);
                            setDiscountAmount(discountValue);
                            updatedPrice = Math.max(0, updatedPrice - discountValue);
                        }
                    } else {
                        setCouponDiscount(0);
                        setDiscountAmount(0);
                    }
                } catch (error) {
                    console.error("Failed to parse DiscountData:", error);
                }
            } else {
                setCouponDiscount(0);
                setDiscountAmount(0);
            }

            setTotalPrice(updatedPrice);
        }else {
    setMRPAmount(0);
    setTotalPrice(0);
    setSavingsAmount(0);
    setCouponDiscount(0);
    setDiscountAmount(0);
}
}, [cartItems, walletAmount]);

    const handleDeliveryTime = (id, time) => {
        setDeliverytime(time);
        setDeliverytimeId(id);
    };

    const handleSelectDate = (date) => {
        setDateValue(date);
    };

    const handlePaymentType = (type) => {
        setPaymentType(type);
    };

    const handleDeliveryType = (type) => {
        setDeliveryType(type);
        if(type === 'Pickup'){
            setDeliveryTypeState(false);
        }        
        else{
            setDeliveryTypeState(true);
        }
    };

    //Place order function
    const handlePlaceOrder = async() => {          
        if (DeliveryType === 'Delivery' && selectedAddress?.Pincode) {
            const addressPincode = selectedAddress.Pincode.toString().trim();
            const isValidPincode = pincodes.some(p => p.toString().trim() === addressPincode);
            if (!isValidPincode) {
                setInfoStatus('Sorry, we do not deliver to your pincode.');
                handleAlertOpen(true);
                return;
            }
        }
        if (Deliverytime === '' && DeliveryType === 'Delivery' && DeliveryTimeList.length !== 0) {
            setInfoStatus('Please choose delivery time');
            handleAlertOpen(true);
        }
        else if (DateValue === null) {
            setInfoStatus('Please select date');
            handleAlertOpen(true);
        }
        else {
            if (PaymentType === '') {
                setInfoStatus('Please choose payment type');
                handleAlertOpen(true);
            } else if (PaymentType === 'COD') {
                setOnlinePayment(false);
                setAlertOpen(false);
                PlaceOrder(0, '');
            } else {
                setOnlinePayment(true);
            }
        }
    };


      



    //Order save API function
   
    const InsertSaleOrderSave = async (master) => {
        try {
            let WhatsAppUrl = "";
            let OwnerMobileNo = "";
            if (whatsapdata.length > 0) {
                ({ WhatsAppUrl, OwnerMobileNo } = whatsapdata[0]);
            }
         //   const pincode1 = selectedAddress.Pincode.toString().trim();
            const response = await API_InsertSaleOrderSave(master, WhatsAppUrl, OwnerMobileNo);
            console.log(response);
    
            if (response.length !== 0) {
                setLoading(false);
                localStorage.removeItem('cartItems');
                setCartItems([]);
                setInfoStatus('Your order has been placed');
                setShowLoader(false);
                handleAlertOpen(true);
            } else {
                setLoading(false);
                setInfoStatus('Your order has been rejected.');
                setShowLoader(false);
                handleAlertOpen(true);
            }
        } catch (error) {
            console.error("Error inserting order details:", error);
            setLoading(false);
            setInfoStatus('Your order has been rejected.');
            setShowLoader(false);
            handleAlertOpen(true);
        }

        
    };
    

    const PlaceOrder = async(onlinePStatus, onlinePaymentId) => {
        setShowLoader(true);
        const OrderDetails = [];
        const cartTotalBeforeDiscount = cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
        if (cartItems.length > 0 && cartItems != null) {
            for (let i = 0; i < cartItems.length; i++) {
                let detailslist = {};
                const itemPrice = cartItems[i].totalPrice || 0;
                const itemDiscount = cartTotalBeforeDiscount > 0
                    ? (discountAmount * (itemPrice / cartTotalBeforeDiscount))
                    : 0;
                detailslist.ProductId = cartItems[i].Id;
                detailslist.ProductName = cartItems[i].Description;
                detailslist.MRP = cartItems[i].MRP;
                detailslist.ItemQty = cartItems[i].item;
                detailslist.DiscountAmt = Number(itemDiscount.toFixed(2));
                detailslist.Salerate = cartItems[i].Price;
                detailslist.WeightType = cartItems[i].UnitType;
                detailslist.CPrice = itemPrice;
                OrderDetails[i] = detailslist;
            }
        };

        const master = [
            {
                Id: 0,
                CustomerRefId: Number(atob(localStorage.getItem("userId"))),
                CutomerName: atob(localStorage.getItem("userName")),
                MobileNo: atob(localStorage.getItem("userMobileNo")),
                Email: atob(localStorage.getItem("userEmail")),
                Address1: selectedAddress.Address1,
                Address2: selectedAddress.Address2,
                City: selectedAddress.City,
                LandMark: selectedAddress.LandMark,
                Pincode: selectedAddress.Pincode,
                lattitude: selectedAddress.Latitude,
                longitude: selectedAddress.Langitude,
                CompanyRefid: selectedAddress.CompanyRefId,
                CompanyName: ServerURL.COMPANY_NAME,
                CompanyMobile: ServerURL.COMPANY_MOBILE,
                CompanyEmail: ServerURL.COMPANY_EMAIL,
                SaleDate: DateValue,
                DeliveryDate: DateValue,
                DeliveryTime: Deliverytime, 
                DeliveryMode: DeliveryType,   
                PaymentMode: PaymentType,
                PaymentId: onlinePaymentId,
                AreaMasterId: null,
                deliveryStoreName: null,                
                DeliveryStatus: 0,                
                NewCustomerStatus: 0,
                CouponDiscount: Number(couponDiscount) || 0.0,
                CouponRefId: couponId,
                OrderCount: 1,
                ReferalAmount: 0.0,
                disper: Number(couponDiscount) || 0.0,
                discamount: Number(discountAmount) || 0.0,
                schargeamount: deliverycharge,
                ReferalBalance: 0,
                coinage: 0,
                DeliveryCharge: deliverycharge,
                WalletAmount: walletAmount,
                WalletStatus: walletAmount > 0 ? 1 : 0,
                WalletPayment: walletAmount,
                TodaySaving: SavingsAmount,
                Grossamt: Number(TotalPrice),
                NetAmount: Number(TotalPrice) + Number(deliverycharge) + Number(HandlingCharge) - Number(ExtraDiscount),                                 
                SaleOrderDetails: OrderDetails,     
                Remarks: "",                    
            },
        ];
       
        await InsertSaleOrderSave(master);

    
    };

    return (
        <>
            <CircularLoader showLoader={showLoader} />
            {OnlinePayment && (
                <RazorpayPayment
                    PlaceOrder={PlaceOrder}
                    OnlinePayment={OnlinePayment}
                    payableamount={Math.max(0, Number(TotalPrice) + Number(deliverycharge) + Number(HandlingCharge) - Number(ExtraDiscount))}
                    usedwalledamount={walletAmount}
                    Customer={selectedAddress}
                />
            )}
            <AddressChangeModal UserId={UserId} setUserId={setUserId} ModalOpen={ModalOpen} handleChangeAddressClose={handleChangeAddressClose} handleAddressSelect={handleChangeAddress} />
            <Modal
                open={AlertOpen}
                onClose={handleAlertClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} align='center'>
                    <Box>
                        <img src={InfoStatus === 'Your order has been placed' ? OrderSuccess : OrderInfo} style={{ width: '80px', height: '80px' }} alt='gif' />
                    </Box>
                    <Typography id="modal-modal-description">
                        {InfoStatus}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button sx={{
                            marginLeft: 'auto',
                            width: 'auto',
                            borderRadius: '3px',
                            padding: '2px 15px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            background: theme.palette.shadowcolorCode.main,
                            border: '1px solid',
                            borderColor: theme.palette.basecolorCode.main,
                            color: theme.palette.basecolorCode.main,
                            boxShadow: 'none',
                            '&:hover': {
                                border: '1px solid',
                                background: theme.palette.basecolorCode.main,
                                borderColor: theme.palette.basecolorCode.main,
                                color: theme.palette.whitecolorCode.main,
                                boxShadow: 'none',
                            }
                        }} size='small' onClick={handleAlertClose} variant='contained'>Okay</Button>
                    </Box>
                </Box>
            </Modal>
            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3, lg: 5 }, py: { xs: 3, md: 4 } }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, letterSpacing: '0.02em' }}>Checkout</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>Review your delivery details, choose the payment method you prefer, and confirm your order in a clean, easy checkout flow.</Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 3, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(0,0,0,0.08)', p: { xs: 2, md: 3 }, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
                                    <CheckCircleIcon color="success" /> Delivery Address
                                </Typography>
                                <Button variant="outlined" size="small" onClick={handleChangeAddress} sx={{ ml: 'auto', borderRadius: 3, px: 2.5, textTransform: 'none', fontWeight: 700, fontSize: 14, color: theme.palette.basecolorCode.main, borderColor: theme.palette.basecolorCode.main }}>
                                    Change address
                                </Button>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Address 1" value={address.Address1 || ''} InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Address 2" value={address.Address2 || ''} InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="City" value={address.City || ''} InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Pincode" value={address.Pincode || ''} InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Landmark" value={address.LandMark || address.Landmark || ''} InputProps={{ readOnly: true }} />
                                </Grid>
                            </Grid>
                        </Paper>


                        <Paper sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 3, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(0,0,0,0.08)', p: { xs: 2, md: 3 }, mb: 3 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, fontWeight: 700 }}>
                                <CheckCircleIcon color="success" /> Delivery Type
                            </Typography>
                            <RadioGroup>
                                <FormControlLabel value="Pickup" control={<Radio checked={DeliveryType === 'Pickup'} onChange={() => handleDeliveryType('Pickup')} size="small" />} label="Pickup" />
                                <FormControlLabel value="Delivery" control={<Radio checked={DeliveryType === 'Delivery'} onChange={() => handleDeliveryType('Delivery')} size="small" />} label="Delivery" />
                            </RadioGroup>
                        </Paper>

                        <Paper sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 3, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(0,0,0,0.08)', p: { xs: 2, md: 3 }, mb: 3 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, fontWeight: 700 }}>
                                <CheckCircleIcon color="success" /> Delivery Time & Date
                            </Typography>
                            {DeliveryTypeState && (
                                <RadioGroup sx={{ mb: 2 }}>
                                    {DeliveryTimeList.map((item) => (
                                        <FormControlLabel key={item.Id} value={item.Id} control={<Radio onChange={() => handleDeliveryTime(item.Id, item.Deliverytime)} value={item.Id} size="small" />} label={item.Deliverytime} />
                                    ))}
                                </RadioGroup>
                            )}
                            <Calendar DateValue={DateValue} handleSelectDate={handleSelectDate} />
                        </Paper>

                        <Paper sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 3, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(0,0,0,0.08)', p: { xs: 2, md: 3 } }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, fontWeight: 700 }}>
                                <CheckCircleIcon color="success" /> Payment Method
                            </Typography>
                            <RadioGroup>
                                <FormControlLabel value="PayOnline" control={<Radio onChange={() => handlePaymentType('PayOnline')} size="small" />} label="Pay Online" />
                                <FormControlLabel value="COD" control={<Radio onChange={() => handlePaymentType('COD')} size="small" />} label="Cash on Delivery" />
                            </RadioGroup>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        border: '1px solid',
                                        borderColor: theme.palette.basecolorCode.main,
                                        background: theme.palette.basecolorCode.main,
                                        color: theme.palette.whitecolorCode.main,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: theme.palette.basecolorCode.main,
                                            borderColor: theme.palette.basecolorCode.main,
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} sx={{ color: theme.palette.whitecolorCode.main }} />
                                    ) : (
                                        'Place Order'
                                    )}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Section - Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 3, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(0,0,0,0.08)', p: { xs: 2, md: 3 } }}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Order Summary</Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {cartItems.map((product) => (
                                    <Box key={product.Id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: 2, borderRadius: 3, backgroundColor: 'rgba(59, 183, 119, 0.05)' }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box
                                                component="img"
                                                sx={{ width: 54, height: 54, borderRadius: 2, objectFit: 'cover' }}
                                                src={ImagePathRoutes.ProductImagePath + product.Img0}
                                                alt={product.Description}
                                            />
                                            <Box>
                                                <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{product.Description}</Typography>
                                                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{product.UnitType}</Typography>
                                                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Qty {product.item} × {product.Price.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'success.main', whiteSpace: 'nowrap' }}>{product.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={1.5}>
                                <Grid item xs={7}>
                                    <Typography variant="body2" color="text.secondary">MRP Total Amount</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body2" align="right">{MRPAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography variant="body2" color="success.main">Total Savings</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body2" align="right" color="success.main">{SavingsAmount.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography variant="body2" color="text.secondary">Delivery fee</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body2" align="right">{deliverycharge.toLocaleString('en-IN', { style: 'currency', currency: ServerURL.CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Payable</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formattedTotalPayable}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};