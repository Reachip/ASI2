import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, currentMessage, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="info" sx={{ width: '100%' }}>
        {currentMessage}
      </Alert>
    </Snackbar>
  );
};

export default Notification;