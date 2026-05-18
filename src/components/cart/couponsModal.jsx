import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { Box, Typography, Button, Modal, TextField, IconButton, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    borderTop: '1px solid #f0f4f9',
    my: 1,
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
        transform: 'none',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(0),
    },
}));


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    background: '#FFF',
    justifyContent: 'space-between',
    padding: '7px 12px',    
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '100%', sm: '100%', md: 350, lg: 500, xl: 500},
    bgcolor: '#f5f1f7',
    borderRadius: '12px',
    boxShadow: 24,
    maxHeight: '70vh',
    overflowY: 'auto',
    scrollbarWidth: 'none'
};

const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
    p: 1,
    pb: 0,
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: 'none',
};

const applyButtonStyle = {
    backgroundColor: '#d1d1d1',
    '&:hover': {
        backgroundColor: '#bfbfbf',
    },
};


const BasicModal = ({ open, handleClose }) => {
    const coupons = [
        {
            code: 'HSL16',
            title: 'Flat Rs.50 off on orders above Rs.750',
            description: 'Offer applicable on total payable amount above ₹75000. (exclusive of any cash applied)',
            details: 'Flat Rs.5000 off on orders above Rs.750 Using RBL Bank Cards',
        },
        {
            code: 'HSL10',
            title: 'Get Flat ₹25 off Using RBL Bank Cards',
            description: 'Offer applicable on total payable amount above ₹450. (exclusive of any cash applied)',
            details: 'Flat Rs.250 off on orders above Rs.450 Using RBL Bank Cards',
        },
        {
            code: 'HSOB16',
            title: 'Get Flat Rs.50 off Using BOBCARD',
            description: 'Offer applicable on total payable amount above ₹500. (exclusive of any cash applied)',
            details: 'Flat Rs.500 off on orders above Rs.500 Using BOBCARD',
        },
    ];

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="apply-coupon-title">
                <Box sx={modalStyle}>
                    <DrawerHeader>
                        <Typography id="apply-coupon-title" component={"p"} fontWeight={600}>
                            Apply Coupons
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon sx={{width: 20, height: 20}} size='small' />
                        </IconButton>
                    </DrawerHeader>
                    <Box sx={{py: 2, px: 1}}>
                        {/* Coupon Input */}
                        <Box mb={2} display="flex">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Coupon Code"
                                size="small"
                                autoComplete='off'
                                sx={{ mr: 2 }}
                            />
                            <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>
                                APPLY
                            </Button>
                        </Box>

                        {/* Available Coupons */}
                        <Typography variant="subtitle1" mb={1}>
                            Available Coupons
                        </Typography>

                        {/* Coupons List */}
                        {coupons.map((coupon, index) => (
                            <Card key={index} sx={cardStyle}>
                                <CardContent sx={{ flex: '1 1 auto', p: 1, pb: 2 }}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {coupon.title}
                                    </Typography>
                                    <Typography variant="body2" color="error">
                                        {coupon.description}
                                    </Typography>
                                    <Typography variant="body2">
                                        {coupon.details}
                                    </Typography>                                    
                                </CardContent>
                                <Button size="small" sx={applyButtonStyle} disabled>
                                        APPLY
                                    </Button>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default function CouponModal() {
    const [ModalOpen, setModalOpen] = React.useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    return (
        <>
            <BasicModal open={ModalOpen} handleClose={handleClose} />
            <Box sx={{ my: 1 }}>
                <Accordion>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" onClick={handleOpen}>
                        <Box sx={{ marginRight: '8px' }}>
                            <svg sx={{ fontWeight: 700 }} height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 195.803 195.803" >
                                <g>
                                    <g>
                                        <g>
                                            <path style={{ fill: '#3BB77E', fontWeight: 700 }} d="M195.803,104.175l-15.958-18.141l9.688-19.612l-19.494-9.616l1.525-23.685l-24.182-1.557
				l-7.315-21.616l-20.915,7.086L104.173,0.002L86.504,15.541L65.146,4.991L54.939,25.648l-21.82-1.396L31.68,46.67L8.668,54.461
				l7.716,22.769L0,91.628l14.315,16.277l-10.604,21.48l21.978,10.851l-1.442,22.457l21.552,1.385l7.383,21.777l22.887-7.748
				l15.561,17.694l16.745-14.731l19.727,9.742l10.275-20.815l24.322,1.568l1.492-23.313l20.389-6.907l-7.125-21.033L195.803,104.175
				z M158.303,143.743l-1.364,21.273l-22.268-1.424l-9.369,18.975l-17.898-8.84l-15.21,13.378l-14.208-16.162l-20.947,7.097
				l-6.735-19.852l-19.512-1.249l1.306-20.414l-20.135-9.942l9.706-19.644L8.7,92.197l14.838-13.048l-7.054-20.829l21.083-7.143
				l1.303-20.392l19.784,1.267l9.284-18.814l19.541,9.656l16.141-14.197l13.618,15.489l18.975-6.428l6.671,19.687l22.139,1.417
				l-1.385,21.638l17.654,8.722L172.504,87l14.609,16.617L170.3,118.401l6.471,19.082L158.303,143.743z"/>
                                        </g>
                                        <g>
                                            <path style={{ fill: '#3BB77E', fontWeight: 700 }} d="M120.707,90.797c-9.18,0-16.763,7.791-16.763,21.784c0.1,13.879,7.58,20.818,16.23,20.818
				c8.868,0,16.552-7.258,16.552-21.895C136.73,98.27,130.431,90.797,120.707,90.797z M120.389,127.742
				c-5.766,0-9.183-6.725-9.076-15.582c0-8.761,3.203-15.7,9.076-15.7c6.51,0,8.965,7.047,8.965,15.489
				C129.354,121.121,126.584,127.742,120.389,127.742z"/>
                                        </g>
                                        <g>
                                            <path style={{ fill: '#3BB77E', fontWeight: 700 }} d="M91.558,82.791c0-13.238-6.406-20.722-16.123-20.722c-9.183,0-16.763,7.802-16.763,21.681
				c0.107,13.983,7.58,20.922,16.23,20.922C83.87,104.676,91.558,97.415,91.558,82.791z M66.144,83.432
				c0-8.761,3.103-15.7,8.969-15.7c6.514,0,8.969,7.047,8.969,15.489c0,9.176-2.777,15.797-8.969,15.797
				C69.247,99.014,65.93,92.29,66.144,83.432z"/>
                                        </g>
                                        <g>
                                            <polygon style={{ fill: '#3BB77E', fontWeight: 700 }} points="115.049,62.07 74.258,133.829 80.234,133.829 121.03,62.07 			" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </Box>
                        <Typography sx={{ color: '#262a33', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>Avail Offers / Coupons</Typography>
                    </AccordionSummary>
                </Accordion>
            </Box>
        </>
    );
}
