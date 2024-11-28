import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';
import CardPreview from '../cards/CardPreview';

const GameNotification = ({ type, isVisible, onHide, playerName = null, attackerCard, defenderCard, initialHp, finalHp }) => {
    const [currentHp, setCurrentHp] = useState(initialHp);

    useEffect(() => {
        if (isVisible && type === 'attack') {
            const interval = setInterval(() => {
                setCurrentHp((prevHp) => {
                    if (prevHp > finalHp) {
                        return prevHp - 1;
                    } else {
                        clearInterval(interval);
                        setTimeout(onHide, 1000);
                        return prevHp;
                    }
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isVisible, type, onHide, finalHp]);

    const getMessage = () => {
        switch (type) {
            case 'turn':
                return playerName ? `It's ${playerName}'s turn!` : "It's your turn!";
            case 'winner':
                return "You win! 🎉";
            case 'loser':
                return "You lose! 😢";
            case 'attack':
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <CardPreview card={attackerCard} />
                        <CardPreview card={{ ...defenderCard, hp: currentHp }} />
                    </Box>
                );
            default:
                return "Notification";
        }
    };

    return (
        <PopupDialog
            open={isVisible}
            onClose={onHide}
            maxWidth="xs"
        >
            <Typography variant="h6" align="center" sx={{ py: 2 }}>
                {getMessage()}
            </Typography>
        </PopupDialog>
    );
};

export default GameNotification;