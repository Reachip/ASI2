import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/authSlice';
import { useWebSocket } from '../../hooks/useWebSocket';
import Navbar from './Navbar';
import Notification from './Notification';

const Layout = ({ children, subtitle }) => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const {
    springSocket,
    nodeSocket,
    chatMessages,
    connectedUsers,
    generatedCard,
    sendChatMessage,
    errorNodeMessage,
  } = useWebSocket(isAuthenticated ? user : null);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    if (generatedCard) {
      setCurrentMessage(`A new card (ID: ${generatedCard.id}) has been successfully generated and added to your deck.`);
      setOpen(true);
    }
  }, [generatedCard]);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        generatedCard,
        springSocket,
        nodeSocket,
        chatMessages,
        connectedUsers,
        onSendMessage: sendChatMessage,
        id: user?.id,
        username: user?.username
      });
    }
    return child;
  });

  return (
    <Box>
      <Navbar subtitle={subtitle} />
      <Notification open={open} currentMessage={errorNodeMessage} onClose={handleClose} />
      <Notification severity="success" variant="filled" open={open} currentMessage={currentMessage} onClose={handleClose} />
      <Container component="main" sx={{ flexGrow: 1, py: 1 }} maxWidth={false}>
        {childrenWithProps}
      </Container>
    </Box>
  );
};

export default Layout;