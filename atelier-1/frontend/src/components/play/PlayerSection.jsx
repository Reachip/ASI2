import React from 'react';
import { Box } from '@mui/material';
import PlayerBoard from './PlayerBoard';

const PlayerSection = ({ player, cards, onCardSelect, selectedCard, isOpponent }) => (
    <Box sx={{ display: 'flex', gap: 2, flex: 1, overflow: 'hidden', marginBottom: isOpponent ? 2 : 0 }}>
        <PlayerBoard
            player={player}
            cards={cards}
            onCardSelect={onCardSelect}
            selectedCard={selectedCard}
            isOpponent={isOpponent}
        />
    </Box>
);

export default PlayerSection;