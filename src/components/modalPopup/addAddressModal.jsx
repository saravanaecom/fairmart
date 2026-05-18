/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Grid, Box, TextField, Typography, Button, Chip, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import CircularLoader from '../../components/circular-loader';
//API's
import { API_InsertCustomerDetails } from '../../services/userServices';
import { ServerURL } from '../../server/serverUrl';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '100%', sm: '100%', md: 700, lg: 900, xl: 900},
    height: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    px: 4,
    pt: 2,
    pb: 4,
};

const mapContainerStyle = { width: '100%', height: '100%' };

const AddAddressModal = ({ EditAddressModalOpen = true, AddressModalOpen, handleAddressModalClose, AddressDetails, UserId, setUserId, fetchCustomerAddress }) => {
    const [markerPosition, setMarkerPosition] = useState({ lat: 13.0843, lng: 80.2705 });
    const defaultAddressDetails = AddressDetails || {};
    const [activeLabel, setActiveLabel] = useState("");
    const [addressFields, setAddressFields] = useState({
        Address1: "",
        Address2: "",
        City: "",
        Pincode: "",
        Landmark: "",
        lattitude: 0,
        longitude: 0,
    });

    const [searchInput, setSearchInput] = useState('');
    const [errors, setErrors] = useState({});
    const [showLoader, setShowLoader] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: ServerURL.MAP_KEY,
        libraries: ['places'],
    });

    const mapRef = useRef();

    useEffect(() => {
        if (AddressModalOpen) {
            const fullAddress = `${addressFields.Address1}, ${addressFields.City}, ${addressFields.Pincode}`;
            geocodeAddress(fullAddress);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddressModalOpen, addressFields]);

    useEffect(() => {
        if (AddressModalOpen) {
            // Initialize address fields when the modal opens
            setAddressFields({
                Address1: defaultAddressDetails.Address1 || '',
                Address2: defaultAddressDetails.Address2 || '',
                City: defaultAddressDetails.City || '',
                Pincode: defaultAddressDetails.Pincode || '',
                Landmark: defaultAddressDetails.Landmark || '',
                lattitude: markerPosition.lat,
                longitude: markerPosition.lng,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const geocodeAddress = useCallback((address) => {
        if (!isLoaded) return;

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                setMarkerPosition({ lat, lng });
                if (mapRef.current) {
                    mapRef.current.setCenter({ lat, lng });
                }
            } else {
                console.error('Geocode was not successful for the following reason:', status);
            }
        });
    }, [isLoaded]);

    const handleSearch = useCallback(() => {
        if (!isLoaded) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);

        const request = {
            query: searchInput,
            fields: ['formatted_address', 'geometry'],
        };

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                setMarkerPosition({ lat, lng });
                reverseGeocode(lat, lng);
            } else {
                console.error('Place not found');
            }
        });
    }, [searchInput, isLoaded]);

    const handleMarkerDragEnd = useCallback((event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });
        reverseGeocode(newLat, newLng);
    }, []);

    const reverseGeocode = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat, lng };

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    const addressComponents = results[0].address_components;
                    let Address1 = '', Address2 = '', City = '', Pincode = '', lattitude = 0, longitude = 0;
                    lattitude = latlng.lat;
                    longitude = latlng.lng;
                    addressComponents.forEach(component => {
                        if (component.types.includes("street_number")) {
                            Address1 = component.long_name;
                        }
                        if (component.types.includes("route")) {
                            Address1 += ` ${component.long_name}`;
                        }
                        if (component.types.includes("sublocality") || component.types.includes("sublocality_level_1")) {
                            Address2 = component.long_name;
                        }
                        if (component.types.includes("locality")) {
                            City = component.long_name;
                        }
                        if (component.types.includes("postal_code")) {
                            Pincode = component.long_name;
                        }                        
                    });

                    setAddressFields({ Address1, Address2, City, Pincode, lattitude, longitude });
                }
            } else {
                console.error('Geocoder failed due to:', status);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressFields(prev => ({ ...prev, [name]: value }));

        // Update errors when input changes
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSave = async() => {
        // if (!AddressDetails) {
        //     console.error("AddressDetails is not provided");
        //     return;
        // }

        setShowLoader(true);

        let objlist =
        {
            Id: defaultAddressDetails.Id ? defaultAddressDetails.Id : 0,
            CompanyRefid: ServerURL.COMPANY_REF_ID,
            CustomerName: defaultAddressDetails.CustomerName ? defaultAddressDetails.CustomerName : "",
            Email: defaultAddressDetails.Email ? defaultAddressDetails.Email : "",
            Password: defaultAddressDetails.Password ? defaultAddressDetails.Password : "",
            MobileNo: defaultAddressDetails.MobileNo ? defaultAddressDetails.MobileNo : "",
            PhoneNo: 0,
            TokenId: "",
            FlatNo: 0,
            AreaMasterRefId: null,
            firstorder: "0",
            ParentId: defaultAddressDetails.ParentId ? defaultAddressDetails.ParentId : Number(atob(localStorage.getItem("userId"))),
            ReferMobileNo: 0,
            Active: 1,
            OrderCount: 0,
            Createddate: new Date(),

            Address1: addressFields.Address1 ? addressFields.Address1 : defaultAddressDetails.Address1,
            Address2: addressFields.Address2 ? addressFields.Address2 : defaultAddressDetails.Address2,
            City: addressFields.City ? addressFields.City : defaultAddressDetails.City,
            Pincode: addressFields.Pincode ? addressFields.Pincode : defaultAddressDetails.Pincode,
            Landmark: addressFields.Landmark ? addressFields.Landmark : defaultAddressDetails.Landmark,
            AddressType: activeLabel ? activeLabel : defaultAddressDetails.AddressType,
            Latitude: markerPosition.lat,
            Langitude: markerPosition.lng,
        };
      

        const newErrors = {};
        // Validate address fields
        if (objlist.Address1 === "" || objlist.Address1 === undefined) newErrors.Address1 = 'Address-1 is required';
        if (objlist.Address2 === "" || objlist.Address2 === undefined) newErrors.Address2 = 'Address-2 is required';
        if (objlist.City === "" || objlist.City === undefined) newErrors.City = 'City is required';
        if (objlist.Pincode === "" || objlist.Pincode === undefined) newErrors.Pincode = 'Pincode is required';
        //if (objlist.Landmark === "" || objlist.Landmark === undefined) newErrors.Landmark = 'Landmark is required';
        // if (activeLabel === 'Other' && (objlist.AddressType === "" || objlist.AddressType === undefined)) {
        //     newErrors.AddressType = 'Label is required when selecting "Other"';
        // }
        let objlist1=[objlist];
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setUserId(objlist.ParentId);
            await InsertCustomerAddressDetails(objlist1); 
            await fetchCustomerAddress(objlist.ParentId);           
            handleAddressModalClose();
        }
    }; 


    const InsertCustomerAddressDetails = async (objlist1) => {
        try {
            const response = await API_InsertCustomerDetails(objlist1);
            if(response.data.length !== 0){
                setShowLoader(false);
                setIsLoading(false);
            }            
        } catch (error) {
            console.error("Error inserting customer address details:", error);
            setShowLoader(false);
            setIsLoading(false);
        }
    };


    return (
        <>
        <CircularLoader showLoader={showLoader} />
        <div>
            <Modal
                open={AddressModalOpen}
                onClose={handleAddressModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="600">
                            Add New Address
                        </Typography>
                        <IconButton onClick={handleAddressModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Search Input Section */}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            autoComplete="off"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            placeholder="Search for an address, Pincode, or City"
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Grid container spacing={2}>
                            {/* Google Map Section */}
                            <Grid item xs={12} md={6}>
                                {isLoaded ? (
                                    <GoogleMap
                                        center={markerPosition}
                                        zoom={15}
                                        mapContainerStyle={mapContainerStyle}
                                        onLoad={map => mapRef.current = map}
                                        onClick={(e) => handleMarkerDragEnd(e)}
                                    >
                                        <Marker
                                            position={markerPosition}
                                            draggable
                                            onDragEnd={handleMarkerDragEnd}
                                        />
                                    </GoogleMap>
                                ) : (
                                    <Typography>Loading Map...</Typography>
                                )}
                            </Grid>

                            {/* Form Section */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography>Address-1</Typography>
                                        <TextField
                                            size="small"
                                            name="Address1"
                                            value={addressFields.Address1 ? addressFields.Address1 : ''} 
                                            placeholder="Enter your address"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.Address1}   
                                            helperText={errors.Address1}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography>Address-2</Typography>
                                        <TextField
                                            size="small"
                                            name="Address2"
                                            value={addressFields.Address2 ? addressFields.Address2 : ''}
                                            placeholder="Enter your address details"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.Address2}
                                            helperText={errors.Address2}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography>City</Typography>
                                        <TextField
                                            size="small"
                                            name="City"
                                            value={addressFields.City}
                                            placeholder="Enter your City"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.City}
                                            helperText={errors.City}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography>Pincode</Typography>
                                        <TextField
                                            size="small"
                                            name="Pincode"
                                            value={addressFields.Pincode}
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.Pincode}
                                            helperText={errors.Pincode}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography>Landmark</Typography>
                                        <TextField
                                            size="small"
                                            name="Landmark"
                                            value={addressFields.Landmark}
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.Landmark}
                                            helperText={errors.Landmark}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body2" fontWeight="bold">Add Address Label</Typography>
                                        <Box sx={{ my: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Chip
                                                label="Home"
                                                onClick={() => setActiveLabel('Home')}
                                                sx={{
                                                    backgroundColor: activeLabel === 'Home' ? '#3BB77E' : '#3bb77e1c',
                                                    color: activeLabel === 'Home' ? 'white' : '#3BB77E',
                                                }}
                                            />
                                            <Chip
                                                label="Work"
                                                onClick={() => setActiveLabel('Work')}
                                                sx={{
                                                    backgroundColor: activeLabel === 'Work' ? '#3BB77E' : '#3bb77e1c',
                                                    color: activeLabel === 'Work' ? 'white' : '#3BB77E',
                                                }}
                                            />
                                            <Chip
                                                label="Other"
                                                onClick={() => setActiveLabel('Other')}
                                                sx={{
                                                    backgroundColor: activeLabel === 'Other' ? '#3BB77E' : '#3bb77e1c',
                                                    color: activeLabel === 'Other' ? 'white' : '#3BB77E',
                                                }}
                                            />
                                        </Box>
                                        {activeLabel === 'Other' && (
                                            <TextField
                                                size="small"
                                                placeholder="Enter your own label"
                                                variant="outlined"
                                                name="AddressType"
                                                value={addressFields.AddressType}
                                                error={!!errors.AddressType}
                                                helperText={errors.AddressType}
                                                onChange={handleInputChange}
                                                fullWidth
                                            />
                                        )}
                                    </Box>

                                    <Button
                                        sx={{
                                            mt: 4,
                                            backgroundColor: '#3bb77e1c',
                                            color: '#3BB77E',
                                            border: '1px solid #3BB77E',
                                        }}
                                        onClick={handleSave}
                                    >
                                        Save & Continue
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </div>
        </>
    );
};

export default AddAddressModal;
