/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import AddAddressModal from '../modalPopup/addAddressModal';
import ConfirmationPopup from '../modalPopup/confirmationPopup';
import { API_FetchCustomerAddress, API_DeleteCustomerAddress } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';
import CircularLoader from '../circular-loader';

const Address = () => {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = useState('Addresses');
  const [customerDetails, setcustomerDetails] = useState([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [UserId, setUserId] = React.useState(0);
  let [objlist, setObjlist] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    addressModalOpen: false,
    addressModalType: '',
    confirmationModalOpen: false,
    currentAddress: '',
  });

  const handleModalOpen = (type, address, Id, ParentId) => {
    if (type === 'New' || type === 'Update') {
      setModalState({
        ...modalState,
        addressModalOpen: true,
        addressModalType: type,
        currentAddress: address,
      });
    } else if (type === 'Delete') {
      setModalState({
        ...modalState,
        type: type,
        confirmationModalOpen: true,
        currentAddress: address,
        Id: Id,
        ParentId: ParentId
      });
    }
    modalState.currentAddress = address;
  };

  const handleModalClose = () => {
    setModalState({
      ...modalState,
      addressModalOpen: false,
      confirmationModalOpen: false,
      currentAddress: null,
    });
  };

  const handleConfirmationAction = async (event) => {
    if (event.target.value === 'Yes') {
      if (modalState.type === "Delete" && modalState.Id !== 0) {
        await DeleteCustomerAddress(modalState.Id);
        await FetchCustomerAddress(modalState.ParentId);
      }
    }
    handleModalClose();
  };

  const FetchCustomerAddress = async (userId) => {
    setShowLoader(true);
    try {
      const address = await API_FetchCustomerAddress(userId);
      setcustomerDetails(address);
      const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
      // Check if selectedAddress exists and update sessionStorage if it matches
      if (selectedAddress) {
        address.forEach((add) => {
          if (selectedAddress.Id === add.Id) {
            sessionStorage.setItem('selectedAddress', JSON.stringify(add));
          }
        });
      }

      objlist = {
        ParentId: address[0].Id,
        CustomerName: address[0].CustomerName,
        Email: address[0].Email,
        MobileNo: address[0].MobileNo
      };
      setIsLoading(false);
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching customer address:", error);
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  //Delete adderess
  const DeleteCustomerAddress = async (userId) => {
    try {
      const response = await API_DeleteCustomerAddress(userId);
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
      setUserId(atob(CId));
      FetchCustomerAddress(atob(CId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigate(`/accounts/${activeComponent}`);
  }, [activeComponent, navigate]);

  return (
    <>
      <CircularLoader showLoader={showLoader} />
      <AddAddressModal
        AddressModalOpen={modalState.addressModalOpen}
        AddressModalType={modalState.addressModalType}
        handleAddressModalClose={handleModalClose}
        AddressDetails={modalState.currentAddress}
        UserId={UserId}
        setUserId={setUserId}
        fetchCustomerAddress={FetchCustomerAddress}
      />
      <ConfirmationPopup
        ConfirmationModalOpen={modalState.confirmationModalOpen}
        handleConfirmationModalClose={handleModalClose}
        handleConfirmationClick={handleConfirmationAction}
      />

      <Box sx={{ background: '#FFF', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.colorCode.main }}>All Saved Addresses</Typography>
          <Button
            variant="contained"
            size='small'
            onClick={() => handleModalOpen('New', objlist, 0)}
            sx={{ background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main, '&:hover': { background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main } }}
          >
            Add New Address
          </Button>
        </Box>
        {customerDetails.map((address, index) => (
          <React.Fragment key={index}>
            <Grid container py={1} mb={2} sx={{px:{sm: 0, md: 3}}} alignItems="center">
              <Grid item xs={1}>
                <Box sx={{ mr: 2 }} align="center">
                  <svg fill="none" height="24" viewBox="0 0 26 26" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9204 18.682L12.552 17.9718H12.552L12.9204 18.682ZM12.0801 18.682L12.4484 17.9718H12.4484L12.0801 18.682ZM19.0891 9.38889C19.0891 11.7465 17.8884 13.6759 16.4236 15.1534C14.9596 16.63 13.2988 17.5845 12.552 17.9718L13.2887 19.3921C14.1073 18.9675 15.9308 17.923 17.5598 16.2798C19.1881 14.6375 20.6891 12.3263 20.6891 9.38889H19.0891ZM12.5002 2.8C16.1392 2.8 19.0891 5.74995 19.0891 9.38889H20.6891C20.6891 4.86629 17.0228 1.2 12.5002 1.2V2.8ZM5.91133 9.38889C5.91133 5.74995 8.86127 2.8 12.5002 2.8V1.2C7.97762 1.2 4.31133 4.86629 4.31133 9.38889H5.91133ZM12.4484 17.9718C11.7017 17.5845 10.0408 16.63 8.57682 15.1534C7.11206 13.6759 5.91133 11.7465 5.91133 9.38889H4.31133C4.31133 12.3263 5.8123 14.6375 7.44059 16.2798C9.06961 17.923 10.8932 18.9675 11.7117 19.3921L12.4484 17.9718ZM12.552 17.9718C12.5307 17.9828 12.5135 17.9858 12.5002 17.9858C12.4869 17.9858 12.4697 17.9828 12.4484 17.9718L11.7117 19.3921C12.2096 19.6504 12.7908 19.6504 13.2887 19.3921L12.552 17.9718ZM14.8668 9.38932C14.8668 10.6964 13.8072 11.756 12.5002 11.756V13.356C14.6909 13.356 16.4668 11.5801 16.4668 9.38932H14.8668ZM12.5002 7.02266C13.8072 7.02266 14.8668 8.08225 14.8668 9.38932H16.4668C16.4668 7.19859 14.6909 5.42266 12.5002 5.42266V7.02266ZM10.1335 9.38932C10.1335 8.08225 11.1931 7.02266 12.5002 7.02266V5.42266C10.3094 5.42266 8.5335 7.19859 8.5335 9.38932H10.1335ZM12.5002 11.756C11.1931 11.756 10.1335 10.6964 10.1335 9.38932H8.5335C8.5335 11.5801 10.3094 13.356 12.5002 13.356V11.756Z" fill="black"></path>
                    <path d="M20.7272 18.3607C21.561 18.8421 22 19.3881 22 19.944C22 20.4999 21.561 21.0459 20.7272 21.5273C19.8934 22.0087 18.6942 22.4085 17.25 22.6864C15.8058 22.9644 14.1676 23.1107 12.5 23.1107C10.8324 23.1107 9.19418 22.9644 7.75 22.6864C6.30582 22.4085 5.10656 22.0087 4.27276 21.5273C3.43896 21.046 3 20.4999 3 19.944C3 19.3881 3.43896 18.8421 4.27276 18.3607" stroke="black" stroke-linecap="round" stroke-width="1.6"></path>
                  </svg>
                </Box>
              </Grid>
              <Grid item xs={8.5}>
                <Box>
                  <Typography align="left" variant="h6" fontWeight={600} fontSize={16} sx={{ color: theme.palette.colorCode.main || '#253D4E' }}>
                    {address.AddressType ? address.AddressType : 'Home'}
                  </Typography>
                  <Typography align="left" variant="body1" fontSize={16} sx={{ color: '#7E7E7E' }}>
                    {`${address.Address1}, ${address.Address2} ${address.City} -${address.Pincode}`}
                  </Typography>
                  <Typography align="left" variant="body1" fontSize={16} sx={{ color: '#7E7E7E' }}>
                    {`${address.Landmark !== null ? address.Landmark : ''}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2.5}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item>
                    <IconButton
                      aria-label="edit"
                      value={address.Id}
                      onClick={() => handleModalOpen('Update', address, address.Id, address.ParentId)}
                    >
                      <Edit />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={address.ParentId === 0 || address.Id === address.ParentId ? true : false}
                      aria-label="delete"
                      value={address}
                      onClick={() => handleModalOpen('Delete', address, address.Id, address.ParentId)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </>
  );
};

export default Address;
