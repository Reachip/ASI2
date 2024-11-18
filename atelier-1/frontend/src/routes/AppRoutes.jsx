import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import BuyCardsPage from '../pages/BuyCardsPage';
import SellCardsPage from '../pages/SellCardsPage';
import CreateCardPage from '../pages/CreateCardPage';
import PlayPage from '../pages/PlayPage';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector(selectAuth);
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout subtitle="Select your action">
              <HomePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/buy"
        element={
          <PrivateRoute>
            <Layout subtitle="BUY a card to complete your deck">
              <BuyCardsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <PrivateRoute>
            <Layout subtitle="SELL your cards to get money">
              <SellCardsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <Layout subtitle="Generate a card">
              <CreateCardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/play"
        element={
          <PrivateRoute>
            <Layout subtitle="Play">
              <PlayPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;