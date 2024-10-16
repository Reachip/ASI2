import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <>
      <Header title="Home Page" subtitle="Welcome to our app" icon="home" />
      <Container>
        <Typography variant="body1">
          This is the homepage of our app.
        </Typography>
      </Container>
    </>
  );
};

export default HomePage;