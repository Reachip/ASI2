import React from 'react';
import { Card as MuiCard, CardMedia, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Card = ({ card, isSelected, onClick }) => {
  return (
    <MuiCard
      onClick={onClick}
      sx={{
        cursor: card.hp === 0 ? 'not-allowed' : 'pointer',
        transform: isSelected ? 'translateY(-8px)' : 'none',
        transition: 'transform 0.2s',
        height: '150px',
        width: '120px',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {card.hp === 0 && (
          <CancelIcon
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'error.main',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />
        )}
        {isSelected && card.hp > 0 && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'success.main',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              zIndex: 1,
            }}
          />
        )}
        <CardMedia
          component="img"
          image={card.imgUrl}
          alt={card.name}
          sx={{
            height: '100%',
            filter: card.hp === 0 ? 'grayscale(100%)' : 'none',
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px',
            textAlign: 'center',
          }}
        >
          {card.name}
        </Typography>
      </Box>
    </MuiCard>
  );
};

export default Card;
