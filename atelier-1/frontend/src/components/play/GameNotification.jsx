import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';
import CardPreview from '../cards/CardPreview';

const GameNotification = ({ type, isVisible, onHide, data = {} }) => {
    const { playerName, attackerCard, defenderCard, initialHp, finalHp } = data;
    const [currentHp, setCurrentHp] = useState(initialHp || 0);
    const animationDuration = 5000;
    const steps = Math.abs(initialHp - finalHp);
    const stepDuration = animationDuration / steps;

    useEffect(() => {
        if (isVisible && type === 'attack') {
            const interval = setInterval(() => {
                setCurrentHp((prevHp) => {
                    if (prevHp > finalHp) {
                        return prevHp - 1;
                    } else {
                        clearInterval(interval);
                        setTimeout(onHide, 2000);
                        return finalHp;
                    }
                });
            }, stepDuration);

            return () => clearInterval(interval);
        }
    }, [isVisible, type, onHide, initialHp, finalHp, stepDuration]);

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
                        <Box>
                            <CardPreview card={defenderCard} />
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                    transition: 'color 0.3s ease-in-out',
                                }}
                            >
                                HP: {currentHp}
                            </Typography>
                        </Box>
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
