import React, { useEffect, useState, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';
import CardPreview from '../cards/CardPreview';

const GameNotification = ({ type, isVisible, onHide, data = {}, duration = 3000 }) => {
    const { playerName, attackerCard, defenderCard, initialHp, finalHp } = data;
    const [currentHp, setCurrentHp] = useState(initialHp || 0);
    const animationRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
        if (isVisible && type === 'attack' && initialHp !== undefined && finalHp !== undefined) {
            const steps = Math.abs(initialHp - finalHp);
            const stepDuration = duration / steps;
            let currentStep = 0;
            setCurrentHp(initialHp);

            if (animationRef.current) clearInterval(animationRef.current);

            animationRef.current = setInterval(() => {
                setCurrentHp((prevHp) => {
                    if (currentStep < steps) {
                        currentStep++;
                        return prevHp > finalHp ? prevHp - 1 : prevHp + 1;
                    } else {
                        clearInterval(animationRef.current);
                        animationRef.current = null;
                        return finalHp;
                    }
                });
            }, stepDuration);
        }

        return () => {
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [isVisible, type, initialHp, finalHp, duration]);

    useEffect(() => {
        if (isVisible) {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = setTimeout(() => {
                onHide();
            }, duration);

            return () => {
                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            };
        }
    }, [isVisible, duration, onHide]);

    const getMessage = () => {
        switch (type) {
            case 'turn':
                return playerName ? `It's ${playerName}'s turn!` : "It's your turn!";
            case 'winner':
                return "You win! 🎉";
            case 'loser':
                return "You lose! 😢";
            case 'endTurn':
                return playerName ? `${playerName} chooses to end turn!` : "You choose to end turn!";
            case 'attack':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" align="center">
                            {playerName ? `${playerName} attacks!` : 'Attack!'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 800 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, width: 'auto' }}>
                                <CardPreview card={attackerCard} sx={{ height: 300, width: 'auto' }} />
                            </Box>
                            <Box
                                component="img"
                                src="../../fight.gif"
                                alt="Fight GIF"
                                sx={{ width: 170, height: 170, objectFit: 'contain' }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, width: 'auto' }}>
                                <CardPreview card={{ ...defenderCard, hp: currentHp }} sx={{ height: 300, width: 'auto' }} />
                            </Box>
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
            maxWidth="lg"
            fullWidth
            sx={{ padding: 3 }}
        >
            <Typography variant="h6" align="center" sx={{ py: 2 }}>
                {getMessage()}
            </Typography>
        </PopupDialog>
    );
};

export default GameNotification;