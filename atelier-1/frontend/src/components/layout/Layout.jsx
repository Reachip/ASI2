import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Notification from './Notification';

const Layout = ({ children, subtitle }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar subtitle={subtitle} />
      <Notification />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;