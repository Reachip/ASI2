import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <>
      <Header title="Home" subtitle="Welcome to the homepage" icon="home" />
      <Container>
        <h2>Home Page Content</h2>
        <p>This is the homepage of our app.</p>
      </Container>
    </>
  );
};

export default HomePage;