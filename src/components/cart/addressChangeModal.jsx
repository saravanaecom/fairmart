import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Modal, Box, Typography, IconButton, Button, Card, CardContent, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { API_FetchCustomerAddress } from '../../services/userServices';
import AddAddressModal from '../modalPopup/addAddressModal';

const DrawerHeader = styled('div')(({ theme }) => ({
    width: '100%',
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
    width: { xs: '100%', sm: '100%', md: 350, lg: 500, xl: 500 },
    bgcolor: '#f5f1f7',
    borderRadius: '12px',
    boxShadow: 24,
    maxHeight: '60vh',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
};

const skeletonStyle = {
    width: '100%',
    height: '75px',
    mb: 2,
};

const AddressChangeModal = ({ UserId, setUserId, ModalOpen, handleChangeAddressClose, handleAddressSelect }) => {
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [AddressNewModalState, setAddressNewModalState] = useState(false);

    useEffect(() => {
        if (UserId !== 0) {            
            fetchCustomerAddress(UserId);
        }
    }, [UserId]);

    const fetchCustomerAddress = async (UserId) => {
        try {
            const address = await API_FetchCustomerAddress(UserId);
            setCustomerDetails(address);
            console.log(address)

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching customer address:", error);
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setAddressNewModalState(false);
    };

    const handleModalOpen = () => {
        setAddressNewModalState(true);
    };

    const handleSelectAddress = (address) => {
        handleAddressSelect(address);
        sessionStorage.setItem('selectedAddress', JSON.stringify(address));
        handleChangeAddressClose();
    };

    return (
        <>
            <AddAddressModal
                AddressModalOpen={AddressNewModalState}
                handleAddressModalClose={handleModalClose}
                UserId={UserId}
                setUserId={setUserId}
                fetchCustomerAddress={fetchCustomerAddress}
            />
            <Modal open={ModalOpen} onClose={handleChangeAddressClose} aria-labelledby="address-modal-title">
                <Box sx={modalStyle}>
                    <DrawerHeader>
                        <Typography id="address-modal-title" component={"p"} fontWeight={600}>
                            Select an Address
                        </Typography>
                        <IconButton onClick={handleChangeAddressClose}>
                            <CloseIcon sx={{ width: 20, height: 20 }} />
                        </IconButton>
                    </DrawerHeader>
                    <Box sx={{ px: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={{ my: 2, color: '#3BB77E', borderColor: '#3BB77E', '&:hover': { background: '#3BB77E', color: '#FFF', borderColor: '#3BB77E' }, cursor: 'pointer' }}
                            onClick={handleModalOpen}
                        >
                            Add Address
                        </Button>

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Saved Addresses
                        </Typography>

                        {isLoading ? (
                            <>
                                <Skeleton variant="rectangular" sx={skeletonStyle} />
                                <Skeleton variant="rectangular" sx={skeletonStyle} />
                                <Skeleton variant="rectangular" sx={skeletonStyle} />
                            </>
                        ) : customerDetails.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">
                                No saved addresses found.
                            </Typography>
                        ) : (
                            customerDetails.map((address, index) => (
                                <Card onClick={() => handleSelectAddress(address)} key={index} sx={{ mb: 1, pb: 0, boxShadow: 'none', cursor: 'pointer', '&:hover': { background: '#f0f0f0' } }}>
                                    <CardContent sx={{ px: 1.5, pb: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon sx={{ color: 'gray' }} />
                                            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                                                {address.AddressType ? address.AddressType : 'Home'}
                                            </Typography>
                                        </Box>
                                        <Typography align="left" variant="body2" fontSize={16} sx={{ color: '#7E7E7E' }}>
                                            {`${address.Address1}, ${address.Address2}, ${address.City} - ${address.Pincode}`}
                                        </Typography>
                                        {address.Landmark && (
                                            <Typography align="left" variant="body2" fontSize={16} sx={{ color: '#7E7E7E' }}>
                                                Landmark: {address.Landmark}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddressChangeModal;
