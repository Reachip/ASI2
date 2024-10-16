import React, { useState } from 'react';
import { Container, TextField, Checkbox, Button, FormControlLabel } from '@mui/material';
import Header from '../components/Header';

const UserFormPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    password: '',
    repassword: '',
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, acceptedTerms: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User created:', formData);
  };

  return (
    <>
      <Header title="Create User" subtitle="Add an user" icon="person_add" />
      <Container>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Re-enter Password"
            name="repassword"
            type="password"
            value={formData.repassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={formData.acceptedTerms} onChange={handleCheckboxChange} />}
            label="I accept the terms and conditions"
          />
          <Button type="submit" variant="contained" color="primary">
            Create User
          </Button>
        </form>
      </Container>
    </>
  );
};

export default UserFormPage;