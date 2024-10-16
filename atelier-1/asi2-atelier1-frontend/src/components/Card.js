import React from 'react';
import { Card as MUICard, CardContent, CardMedia, Typography } from '@mui/material';

const Card = ({ image, title, description, extra }) => (
  <MUICard>
    {image && <CardMedia component="img" height="140" image={image} alt={title} />}
    <CardContent>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="textSecondary">{description}</Typography>
    </CardContent>
    {extra && <Typography variant="body2">{extra}</Typography>}
  </MUICard>
);

export default Card;