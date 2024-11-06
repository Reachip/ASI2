import React from 'react';
import { Box, Typography } from '@mui/material';
import ActionPoints from './ActionPoints';
import Card from '../cards/Card';
import CardPreview from '../cards/CardPreview';

const PlayerBoard = ({ player, cards, onCardSelect, selectedCard, isOpponent }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'divider',
        flex: 1,
    }}>
        {/* Left section for cards and header */}
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid',
            borderColor: 'divider',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}>
                <Typography variant="h6">
                    {player.username}
                </Typography>
                <ActionPoints points={player.actionPoints} />
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                padding: '20px',
                overflow: 'auto',
            }}>
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        isSelected={selectedCard?.id === card.id}
                        onClick={() => onCardSelect(card)}
                    />
                ))}
            </Box>
        </Box>

        {/* Right section for CardPreview */}
        <Box sx={{
            width: '25%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5px',
        }}>
            <CardPreview card={selectedCard} />
        </Box>
    </Box>
);

export default PlayerBoard;
