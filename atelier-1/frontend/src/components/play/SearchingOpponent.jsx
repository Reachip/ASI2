import React from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import Card from '../cards/Card';

const SearchingOpponent = ({ selectedCards }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                p: 4,
                minHeight: '400px',
            }}
        >
            <Box
                sx={{
                    width: 150,
                    height: 150,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress size={60} />
            </Box>

            <Typography variant="h5" component="h2" textAlign="center">
                Searching for an opponent...
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
                Please wait while we find the ideal challenger
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {selectedCards.map((card) => (
                    <Grid item key={card.id}>
                        <Card
                            card={card}
                            isSelected={false}
                            onClick={() => { }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SearchingOpponent;