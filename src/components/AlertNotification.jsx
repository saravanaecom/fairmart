import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AlertNotification({ showNotify, showNotifyMsg, showNotifyError }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (showNotify === true) {
      setOpen(true);
    }
  }, [showNotify]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={showNotifyError === 'success' ? 'success' : 'error'}>
        {showNotifyMsg}
      </Alert>
    </Snackbar>
  );
}

export default AlertNotification;
