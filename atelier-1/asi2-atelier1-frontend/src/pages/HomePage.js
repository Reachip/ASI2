import React from 'react';
import { Container, Button, Box } from '@mui/material';
import { AttachMoney, ShoppingCart, Science } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Home Page" subtitle="Select your action" icon="home" />
      <Container>
        <Box display="flex" justifyContent="space-evenly" alignItems="center" my={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AttachMoney />}
            onClick={() => navigate('/sell')}
          >
            Sell
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={() => navigate('/buy')}
          >
            Buy
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Science />}
            onClick={() => navigate('/create-user')}
          >
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;