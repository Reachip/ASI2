import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const defaultMessage = 'Test message on page load';
    setCurrentMessage(defaultMessage);
    setOpen(true);
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8086');

    webSocket.onmessage = (event) => {
      const newMessage = event.data;
      setCurrentMessage(newMessage);
      setOpen(true);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      webSocket.close();
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {currentMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Notification;
