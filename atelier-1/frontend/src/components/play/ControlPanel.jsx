import React from 'react';
import { Box, Button } from '@mui/material';

const ControlPanel = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', py: 1, px: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary">End Turn</Button>
            <Button variant="contained" color="error">Attack</Button>
        </Box>
    </Box>
);

export default ControlPanel;