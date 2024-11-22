import React from 'react';
import { Card as MuiCard, CardMedia, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Card = ({ card, isSelected, onClick }) => {
  return (
    <MuiCard
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transform: isSelected ? 'translateY(-8px)' : 'none',
        transition: 'transform 0.2s',
        height: '150px',
        width: '120px',
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {isSelected && (
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
          image={card.img_src}
          alt={card.name}
          sx={{ height: '100%' }}
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