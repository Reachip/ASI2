import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Paper
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const CardPreview = ({ 
  card, 
  onAction, 
  actionLabel = "Buy for",
  actionColor = "primary",
  showAction = true
}) => {
  if (!card) return null;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Card>
        <Box sx={{ position: 'relative' }}>
          <Chip
            label={card.family_name}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
            }}
          />
          <CardMedia
            component="img"
            height="200"
            image={card.img_src}
            alt={card.name}
          />
        </Box>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            {card.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ height: 80, overflow: 'auto', mb: 2 }}
          >
            {card.description}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Chip icon={<FavoriteIcon />} label={`HP: ${card.hp}`} size="small" />
            <Chip
              icon={<FlashOnIcon />}
              label={`Energy: ${card.energy}`}
              size="small"
            />
            <Chip
              icon={<SecurityIcon />}
              label={`Defense: ${card.defense}`}
              size="small"
            />
            <Chip
              icon={<WhatshotIcon />}
              label={`Attack: ${card.attack}`}
              size="small"
            />
          </Box>
          {showAction && (
            <Button
              variant="contained"
              color={actionColor}
              fullWidth
              onClick={() => onAction(card)}
              sx={{ mt: 2 }}
            >
              {actionLabel} {card.price}$
            </Button>
          )}
        </CardContent>
      </Card>
    </Paper>
  );
};

export default CardPreview;