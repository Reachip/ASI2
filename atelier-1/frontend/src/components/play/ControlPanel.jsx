import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const ControlPanel = ({ onAttack, canAttack, onEndTurn, currentPlayerName, isPlayerTurn }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 1,
            px: 2,
            flexShrink: 0,
        }}
    >
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                color="error"
                onClick={onAttack}
                disabled={!canAttack}
            >
                Attack
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={onEndTurn}
            >
                End turn
            </Button>
        </Box>
        <Typography
            variant="h6"
            color={isPlayerTurn ? "primary" : "text.secondary"}
        >
            {isPlayerTurn ? `It's your turn!` : `It's ${currentPlayerName}'s turn!`}
        </Typography>
    </Box>
);

export default ControlPanel;
