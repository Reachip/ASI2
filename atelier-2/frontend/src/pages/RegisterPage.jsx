import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { registerUser, selectAuth } from '../store/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (!formData.acceptTerms) {
      setValidationError('You must accept the terms of service');
      return;
    }

    const userData = {
      pwd: formData.password,
      account: 5000,
      lastName: formData.lastName,
      surName: formData.firstName,
      username: formData.username,
      email: '',
      cardList: [],
    };

    dispatch(registerUser(userData));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {(validationError || error) && (
          <Typography color="error" align="center" gutterBottom>
            {validationError || error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            margin="normal"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            margin="normal"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
            }
            label="I accept the Terms of Service"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Loading...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;