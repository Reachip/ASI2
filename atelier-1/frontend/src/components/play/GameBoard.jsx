import React from 'react';
import { Box } from '@mui/material';
import PlayerSection from './PlayerSection';
import ControlPanel from './ControlPanel';

const GameBoard = ({ opponent, currentPlayer, opponentCards, playerCards, selectedOpponentCard, selectedPlayerCard, onOpponentCardSelect, onPlayerCardSelect }) => (
    <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', minHeight: 0, margin: 0, padding: 0 }}>
        <PlayerSection
            player={opponent}
            cards={opponentCards}
            onCardSelect={onOpponentCardSelect}
            selectedCard={selectedOpponentCard}
            isOpponent
        />
        <ControlPanel />
        <PlayerSection
            player={currentPlayer}
            cards={playerCards}
            onCardSelect={onPlayerCardSelect}
            selectedCard={selectedPlayerCard}
        />
    </Box>
);

export default GameBoard;