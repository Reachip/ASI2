import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children, subtitle }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar subtitle={subtitle} />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;