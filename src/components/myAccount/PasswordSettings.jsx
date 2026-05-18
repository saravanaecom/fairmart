/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { API_UpdateCustomerPassword } from '../../services/userServices';
import { useTheme } from '@mui/material/styles';

const PasswordSettings = ({ customerDetails }) => {
  const theme = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle validation and API call
  const handleUpdatePassword = async () => {
    const userId = localStorage.getItem("userId");
    const CId = userId ? decodeURIComponent(userId) : null;
    setErrorMessage('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await API_UpdateCustomerPassword(atob(CId), oldPassword, newPassword, confirmPassword);
      if (response.ok) {
        setErrorMessage('Password updated successfully');
        // Reset form fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(response.message || 'Error updating password');
      }
    } catch (error) {
      setErrorMessage('Failed to update password. Please try again later.');
    }
  };

  return (
    <Box
      align="left"
      sx={{
        background: '#FFF',
        maxHeight: '700px',
        overflowY: 'scroll',
        p: 2,
        borderRadius: 2,
      }}
    >
      {/* Form Section */}
      <Box component="form" noValidate autoComplete="off">
        <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
          Old password
        </Typography>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ mb: 2, mt: 0.5 }}
        />

        <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
          New password
        </Typography>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2, mt: 0.5 }}
        />

        <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
          Confirm password
        </Typography>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2, mt: 0.5 }}
        />

        {/* Error Message */}
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

      </Box>

      {/* Update Account Button */}
      <Box>
        <Button
          variant="contained"
          sx={{
            background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main, '&:hover': {background: theme.palette.basecolorCode.main, color: theme.palette.whitecolorCode.main},
            marginTop: '16px',
            textTransform: 'none',
            float: 'right',
          }}
          onClick={handleUpdatePassword}
        >
          Update Account
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordSettings;
