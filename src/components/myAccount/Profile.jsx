import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Profile = ({customerDetails}) => {
  const theme = useTheme();
  return (
    <Box align="left" sx={{ background: theme.palette.whitecolorCode.main || '#FFF', maxHeight: '700px', overflowY: 'scroll', p: 2, borderRadius: 2 }}>
              {/* Form Section */}
              <Box component="form" noValidate autoComplete="off">
                <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  defaultValue={customerDetails[0].CustomerName}
                  sx={{ mb: 2, mt: 0.5 }}
                />
                <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  defaultValue={customerDetails[0].Email}
                  sx={{ mb: 2, mt: 0.5 }}
                />

                <Typography sx={{ width: '100%', display: 'block' }} variant="p" gutterBottom>
                  Mobile number
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  defaultValue={customerDetails[0].MobileNo}
                  sx={{ mb: 2, mt: 0.5 }}
                />

              </Box>

              {/* Delete Account Section */}
              <Box>
                <Typography variant="p" color="error">
                  Deleting your account will remove all your orders, wallet amount and any active referral.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    marginTop: "16px",
                    textTransform: "none",
                    float: "right",
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>

  );
};

export default Profile;
