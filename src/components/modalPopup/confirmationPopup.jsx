import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
//import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationPopup({ConfirmationModalOpen, handleConfirmationModalClose, handleConfirmationClick}) {

  return (
    <React.Fragment>      
      <Dialog
        open={ConfirmationModalOpen}
        onClose={handleConfirmationModalClose}
      >
        <DialogTitle style={{ fontSize: {xs: 14, sm: 16, md: 18} }}>
          Do you want delete the details?
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText>
            Do you want delete the details?
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button value={"No"} autoFocus onClick={handleConfirmationClick}>
            No
          </Button>
          <Button value={"Yes"} onClick={handleConfirmationClick}>Yes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
