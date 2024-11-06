import React from 'react';
import { Box, Typography } from '@mui/material';

const ActionPoints = ({ points, total = 3 }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: '150px' }}>
        <Typography variant="body2" sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
            Action Points: {points}
        </Typography>
        <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.300', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ width: `${(points / total) * 100}%`, height: '100%', bgcolor: 'primary.main', transition: 'width 0.3s ease' }} />
        </Box>
    </Box>
);

export default ActionPoints;
