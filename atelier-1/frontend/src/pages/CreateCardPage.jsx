import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Checkbox, FormControlLabel } from '@mui/material';

const CreateCardPage = () => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);

  const handleGenerate = () => {
    if (!acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation.");
      return;
    }

    fetch('http://localhost:8080/api/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptImage: imagePrompt,
        promptText: descriptionPrompt,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const newCard = {
          family_name: "Directeur de CPE Lyon",
          img_src: "https://i.f1g.fr/media/eidos/805x453_crop/2023/03/30/XVM15d6a7b2-cf00-11ed-b639-21ccb65c18f2.jpg",
          name: "New Card",
          description: "Gérard Pignault est le directeur de CPE Lyon, une école d'ingénieurs spécialisée dans la chimie, le génie des procédés, et les sciences numériques. Il a pris la tête de cette institution en septembre 2004. Pignault est diplômé de l'École Polytechnique (promotion 1981) et a obtenu un doctorat en physique théorique à l'Université de Paris 11 en 1985, avant de poursuivre un post-doctorat en physique nucléaire aux États-Unis.",
          hp: 100,
          energy: 100,
          attack: 50,
          defense: 50
        };

        setGeneratedCard(newCard);
      })
      .catch(error => {
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

      {/* <Box sx={{ mt: 4, maxWidth: '400px', mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Card Preview
        </Typography>
        <CardPreview card={generatedCard} showAction={false} />
      </Box> */}
    </Box>
  );
};

export default CreateCardPage;