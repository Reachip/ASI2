import React, { useState } from 'react';
import { Container, TextField, Checkbox, Button, FormControlLabel } from '@mui/material';
import Header from '../components/Header';

const CreatePage = () => {
  const [formData, setFormData] = useState({
    imagePrompt: '',
    descriptionPrompt: '',
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
    console.log('Card created:', formData);
  };

  return (
    <>
      <Header title="Create User" subtitle="Generate a card" icon="person_add" />
      <Container>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Image Prompt"
            name="image_prompt"
            value={formData.imagePrompt}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description Prompt"
            name="description_prompt"
            value={formData.descriptionPrompt}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={formData.acceptedTerms} onChange={handleCheckboxChange} />}
            label="I accept the terms and conditions"
          />
          <Button type="submit" variant="contained" color="primary">
            Generate
          </Button>
        </form>
      </Container>
    </>
  );
};

export default CreatePage;