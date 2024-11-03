import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';

const CreateCardPage = () => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleGenerate = () => {
    if (!acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    fetch('http://localhost:8080/api/generateCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptImage: imagePrompt,
        promptText: descriptionPrompt,
      }),
    })
      .then(response => {
        if (response.ok) {
          setSuccessOpen(true);
          return response.json();
        } else {
          throw new Error('La génération de la carte a échoué');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate a card
      </Typography>
      <TextField
        fullWidth
        label="Image Prompt"
        value={imagePrompt}
        onChange={(e) => setImagePrompt(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description Prompt"
        value={descriptionPrompt}
        onChange={(e) => setDescriptionPrompt(e.target.value)}
        margin="normal"
      />
      <FormControlLabel
        control={<Checkbox checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />}
        label="I accept the Terms of Service"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        disabled={!acceptTerms}
        sx={{ mt: 2 }}
      >
        Generate Card
      </Button>

      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          La génération de la carte est en cours...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateCardPage;