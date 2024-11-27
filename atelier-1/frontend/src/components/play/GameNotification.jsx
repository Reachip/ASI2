import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';

const GameNotification = ({ type, isVisible, onHide, playerName = null }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onHide();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    const getMessage = () => {
        switch (type) {
            case 'turn':
                return playerName ? `It's ${playerName}'s turn!` : "It's your turn!";
            case 'winner':
                return "You win! 🎉";
            case 'loser':
                return "You lose! 😢";
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