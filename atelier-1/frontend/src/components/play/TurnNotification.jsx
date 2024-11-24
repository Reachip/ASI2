import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import PopupDialog from '../layout/PopupDialog';

const TurnNotification = ({ playerName, isVisible, onHide }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onHide();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    return (
        <PopupDialog
            open={isVisible}
            onClose={onHide}
            maxWidth="xs"
        >
            <Typography variant="h6" align="center" sx={{ py: 2 }}>
                Au tour de {playerName} !
            </Typography>
        </PopupDialog>
    );
};

export default TurnNotification;