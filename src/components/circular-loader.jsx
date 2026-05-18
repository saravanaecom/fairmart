import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoader({ showLoader }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
