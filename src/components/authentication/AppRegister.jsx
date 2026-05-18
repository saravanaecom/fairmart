import React, { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { TextField, Button, Typography, Link, IconButton, InputAdornment ,CircularProgress} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AppLogo from '../logo/AppLogo';
import {ServerURL} from '../../server/serverUrl';
import {useAuth} from '../../context/authContext';
import { useTheme } from '@mui/material/styles';
import CircularLoader from '../../components/circular-loader';
import { API_FetchSelectSettingsNew } from '../../services/settings';

//API's
import { checkExistingUser, registerUser,otpverification } from '../../services/userServices';

export default function AppRegister({ RegisterDrawerOpen, setLoginDrawerOpen, handleAuthDrawerToggle }) {
  const theme = useTheme();
  const { setIsAuthenticated, setIsAuthenticatedName } = useAuth();
  const [showLoader, setShowLoader] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ShowErrorMsg, setShowErrorMsg] = useState('');
  const [whatsapdata, setwhatsapdata] = React.useState([]);
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
 
  // Error state for validation
  const [errors, setErrors] = useState({});

  // Form state
  let [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',    
  }); 


  useEffect(() => {
     
    FetchSelectSettingsNew();   
}, []);
  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let objList = [{     
      Id: 0,
      CompanyRefid: ServerURL.COMPANY_REF_ID,
      CustomerName: formData.fullname,
      Address1: "",
      Address2: "",
      City: "",
      Pincode: "",
      Email: formData.email,
      Password: formData.password,
      MobileNo: formData.mobileNumber,
      PhoneNo: 0,
      TokenId: "",
      Landmark: "",
      FlatNo: 0,
      AreaMasterRefId: null,
      firstorder: "0",
      lattitude: 0,
      longitude: 0,
      ParentId: 0,
      ReferMobileNo: 0,
      Active: 1,
      OrderCount: 0,
      Createddate: new Date(),
  }];



  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   objList = [{
  //     CustomerName: formData.fullname,
  //     MobileNo: formData.mobileNumber,
  //     Password: formData.password,
  //     Email: formData.email,
  //   }];
  // }, [formData]);
  

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Validation logic
  const validate = () => {
    let tempErrors = {};

    if (!formData.fullname) tempErrors.fullname = "Full name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid";
    }
    if (!formData.mobileNumber) {
      tempErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      tempErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at most 6 characters";
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
 
  const FetchSelectSettingsNew = async () => {
    try {


        const list = await API_FetchSelectSettingsNew();
  

        if (Array.isArray(list) && list.length > 0) {
            setwhatsapdata(list); 
    
        } else {
            console.error("Fetched data is not a valid array or is empty.");
            setwhatsapdata([]); 
        }
    } catch (error) {
        setwhatsapdata([]);
        console.error("Error fetching categories:", error);
    }
};





  // Check if email or mobile number already exists
  const handleSubmit = async (e) => {
    e.preventDefault();
    let WhatsAppUrl = "";
    var mobileno = formData.mobileNumber.toString();
  
    if (!validate()) return;
    setShowLoader(true);
  
    try {
      const existingUser = await checkExistingUser(formData.email, formData.mobileNumber); 
  
      if (existingUser.length !== 0) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email or Mobile numbers are already in use" }));
        setShowLoader(false);
        return;
      }
  
      // Check WhatsApp data
      if (whatsapdata.length > 0) {
        ({ WhatsAppUrl } = whatsapdata[0]);
      }
  
      // Request OTP
      const otpresponse = await otpverification(WhatsAppUrl, mobileno);
  
      if (otpresponse) {
        // OTP verification is successful, show input for OTP

        const otpString = otpresponse.toString();
        setReceivedOtp(otpString);  // OTP received from backend
        setShowOtpInput(true);  // Show OTP input field
        setShowLoader(false);  // Hide loader
  
      } else {
        setShowLoader(false);
        setShowErrorMsg("Failed to send OTP. Please try again.");
      }
  
    } catch (error) {
      console.log("Error:", error);
      setShowLoader(false);
      handleAuthDrawerToggle(false); 
      setLoginDrawerOpen(false); 
    }
  };
  
  // Function to handle OTP input change
  const handleOtpInputChange = (e) => {
    setEnteredOtp(e.target.value);
  };
  
  // Function to submit OTP and verify
  const handleOtpSubmit = async () => {
    if (receivedOtp.toString() === enteredOtp) {
      setIsOtpValid(true);
  
      try {
        // OTP is valid, proceed with registration
        const response = await registerUser(objList);
  
        if (response.Id !== 0 && response.Id !== undefined) {
          // Store user info in localStorage
          localStorage.setItem("userLogin", 'true');
          localStorage.setItem("userId", btoa(response.Id));
          localStorage.setItem("userName", btoa(response.CustomerName));
          localStorage.setItem("userMobileNo", btoa(response.MobileNo));
          localStorage.setItem("userEmail", btoa(response.Email));
  
          // Set authenticated state
          setIsAuthenticated(true);
          setIsAuthenticatedName(response.CustomerName);
  
          // Close authentication drawer
          handleAuthDrawerToggle(false);
          setLoginDrawerOpen(false);
  
        } else {
          setShowErrorMsg("Registration failed.");
        }
      } catch (error) {
        console.error("Registration Error:", error);
        setShowErrorMsg("An error occurred during registration.");
      }
    } else {
      setIsOtpValid(false);
      setShowErrorMsg("Invalid OTP. Please try again.");
    }
  };
  





  return (
    <>
      <CircularLoader showLoader={showLoader} />
      <Drawer
        open={RegisterDrawerOpen}
        anchor="right"
        onClose={() => handleAuthDrawerToggle(false)}
      >
        <Box sx={{
          width: 400,
          padding: 2,
        }}>
          <AppLogo />


          <div className="flex justify-center items-center">
            <div className="w-96 p-3 rounded-md bg-white">
              <Typography variant="h5" align="center" sx={{ my: 2 }}>
                Create an Account
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  error={!!errors.fullname}
                  helperText={errors.fullname}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  className="mb-4"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  className="mb-4"
                  required
                />

                <TextField
                  fullWidth
                  label="Mobile Number"
                  variant="outlined"
                  margin="normal"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  className="mb-4"
                  required
                />
                    
                  {/* OTP Input Box */}
          {showOtpInput && (
            <div>
              <TextField
                fullWidth
                label="Enter OTP"
                variant="outlined"
                margin="normal"
                value={enteredOtp}
                onChange={handleOtpInputChange}
                error={!!ShowErrorMsg}
                helperText={ShowErrorMsg || ''}
                InputLabelProps={{ shrink: true }}
                className="mb-4"
                required
              />
              <Button 
                fullWidth
                variant="contained"
                sx={{
                  my: 3,
                  backgroundColor: theme.palette.basecolorCode.main,
                  color: theme.palette.whitecolorCode.main,
                  '&:hover': {
                    backgroundColor: theme.palette.basecolorCode.main,
                    color: theme.palette.whitecolorCode.main,
                  },
                }}
                onClick={handleOtpSubmit}
              >
                Verify OTP
              </Button>
            </div>
          )}

          {/* Loader while processing */}
          {showLoader && (
            <div className="flex justify-center mt-4">
              <CircularProgress />
            </div>
          )}
              
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputLabelProps={{ shrink: true }}
                  className="mb-6"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputLabelProps={{ shrink: true }}
                  className="mb-6"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography sx={{textAlign: 'center', color: 'red'}}>{ShowErrorMsg}</Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ my: 3, background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main, '&:hover': {background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main} }}
                  type="submit"
                >
                  Create Account
                </Button>
              </form>

               



              <Typography variant="body2" align="left" className="mt-10">
                Already have an account?{' '}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    handleAuthDrawerToggle(false); 
                    setLoginDrawerOpen(true); 
                  }}
                >
                  Login
                </Link>
              </Typography>
            </div>
          </div>
        </Box>
      </Drawer>

      {/* Login Drawer Component */}
      {/* <AppLogin
        LoginDrawerOpen={loginDrawerOpen}
        handleLoginDrawerToggle={setLoginDrawerOpen}
      /> */}
    </>
  );
}


