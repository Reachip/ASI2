import React from 'react';
import { Grid, Typography } from '@mui/material';
import Card from '../cards/Card';

const CardsGrid = ({ cards, selectedCards, onCardSelect, maxSelectable = 5 }) => {
    const handleCardClick = (card) => {
        if (selectedCards.some(c => c.id === card.id)) {
            onCardSelect(selectedCards.filter(c => c.id !== card.id));
        } else if (selectedCards.length < maxSelectable) {
            onCardSelect([...selectedCards, card]);
        }
    };

    return (
        <div>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Sélectionnez {maxSelectable} cartes ({selectedCards.length} sélectionnée{selectedCards.length !== 1 ? 's' : ''})
            </Typography>
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
                        <Card
                            card={card}
                            isSelected={selectedCards.some(c => c.id === card.id)}
                            onClick={() => handleCardClick(card)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default CardsGrid;