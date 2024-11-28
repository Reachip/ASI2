import React from 'react';
import { Box } from '@mui/material';
import PlayerSection from './PlayerSection';
import ControlPanel from './ControlPanel';

const GameBoard = ({ 
    opponent, 
    currentPlayer, 
    opponentCards, 
    playerCards, 
    selectedOpponentCard, 
    selectedPlayerCard, 
    onOpponentCardSelect, 
    onPlayerCardSelect,
    onAttack,
    onEndTurn,
    isPlayerTurn,
    currentPlayerName
}) => (
    <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', minHeight: 0, margin: 0, padding: 0 }}>
        <PlayerSection
            player={opponent}
            cards={opponentCards}
            onCardSelect={onOpponentCardSelect}
            selectedCard={selectedOpponentCard}
            isOpponent
        />
        <ControlPanel 
            onAttack={onAttack}
            canAttack={!!(selectedPlayerCard && selectedOpponentCard && isPlayerTurn)}
            onEndTurn={onEndTurn}
            currentPlayerName={currentPlayerName}
            isPlayerTurn={isPlayerTurn}
        />
        <PlayerSection
            player={currentPlayer}
            cards={playerCards}
            onCardSelect={onPlayerCardSelect}
            selectedCard={selectedPlayerCard}
        />
    </Box>
);

export default GameBoard;