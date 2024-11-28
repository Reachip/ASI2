import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';
import CardPreview from '../cards/CardPreview';

const GameNotification = ({ type, isVisible, onHide, data = {}, duration = 3000 }) => {
    const { playerName, attackerCard, defenderCard, initialHp, finalHp } = data;
    const [currentHp, setCurrentHp] = useState(initialHp || 0);
    const steps = Math.abs(initialHp - finalHp);
    const stepDuration = duration / steps; 

    useEffect(() => {
        setCurrentHp(initialHp);

        if (isVisible && type === 'attack') {
            let currentStep = 0;

            const interval = setInterval(() => {
                setCurrentHp((prevHp) => {
                    if (currentStep < steps) {
                        currentStep++;
                        return prevHp - 1;
                    } else {
                        clearInterval(interval);
                        setTimeout(() => {
                            onHide();
                        }, 3000);
                        return finalHp;
                    }
                });
            }, stepDuration);

            return () => clearInterval(interval);
        }
    }, [isVisible, type, initialHp, finalHp, steps, stepDuration, onHide]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onHide();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onHide]);

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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
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