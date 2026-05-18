/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { TextField, Button, Typography, Link } from '@mui/material';
import AppLogo from '../logo/AppLogo';
import { useAuth } from '../../context/authContext';
import { useTheme } from '@mui/material/styles';
import { ServerURL } from '../../server/serverUrl';
//API
import { forgetpasswordUser } from '../../services/userServices';

export default function AppForgetPassword({ ForgetPasswordDrawerOpen, setLoginDrawerOpen, handleAuthDrawerToggle }) {
  const theme = useTheme();
  const { setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [ErrorMsgContent, setErrorMsgContent] = useState('');
  const [ErrorMsg, setErrorMsg] = useState(false);

  // Error state for validation
  const [errors, setErrors] = useState({});

  // Form state
  const [ForgetData, setForgetData] = useState({
    Email: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setErrorMsg(false);
    setForgetData({
      ...ForgetData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle Password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Validation logic for login
  const validate = () => {
    let tempErrors = {};
    if (!ForgetData.Email) {
      tempErrors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(ForgetData.Email)) {
      tempErrors.Email = "Email is not valid";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await forgetpasswordUser(ForgetData.Email, ServerURL.COMPANY_REF_ID, ServerURL.COMPANY_NAME, ServerURL.COMPANY_MOBILE, ServerURL.COMPANY_EMAIL);
      if (response !== "" && response !== "Not found") {
        setErrorMsgContent('Your password sent to your register mail address, Please check it.')
        setErrorMsg(true);
      } else {
        setErrorMsg(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMsg(true);
    }
  };

  return (
    <>
      <Drawer
        open={ForgetPasswordDrawerOpen}
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
                Forget Your Account
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  name="Email"
                  type="email"
                  value={ForgetData.Email}
                  onChange={handleChange}
                  error={!!errors.Email}
                  helperText={errors.Email}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  className="mb-4"
                  required
                />

                {ErrorMsg && (
                  <>
                    <Box>
                      <Typography color="error" align="center">{ErrorMsgContent !== '' ? ErrorMsgContent : 'Invalid Email address.'}</Typography>
                      <Typography align='center' variant="body2" className="mt-10">
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
                    </Box>
                  </>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ my: 3, background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main }}
                  type="submit"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </Box>
      </Drawer>
    </>
  );
}
