import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

import { Typography, TextField, Button, Box, Checkbox, FormControlLabel } from '@mui/material';
import Notification from '../components/layout/Notification';
import CardPreview from '../components/cards/CardPreview';

const CreateCardPage = ({ generatedCard }) => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

   const { user } = useSelector(selectAuth);
   const username = user?.username;

  const handleGenerate = () => {
    if (!acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);

    fetch('http://localhost:8088/generateCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptImage: imagePrompt,
        promptText: descriptionPrompt,
        username: username
      }),
    })
      .then(response => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);

        if (response.ok) {
          return response.json();
        } else {
          throw new Error('La génération de la carte a échoué');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
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

      <Box sx={{ mt: 4, maxWidth: '400px', mx: 'auto' }}>
        {generatedCard && <Typography variant="h5" gutterBottom>Card Preview</Typography>}
        {generatedCard && <CardPreview card={generatedCard} showAction={false} />}
      </Box>

      <Notification open={loading} currentMessage="Card generation in progress..." onClose={() => setLoading(false)} />
    </Box>
  );
};

export default CreateCardPage;