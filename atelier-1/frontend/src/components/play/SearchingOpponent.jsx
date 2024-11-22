import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const SearchingOpponent = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                p: 4,
                minHeight: '400px', // Garantit une hauteur minimale similaire à la grille de cartes
            }}
        >
            {/* Espace réservé pour le futur GIF */}
            <Box
                sx={{
                    width: 200,
                    height: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress size={60} />
            </Box>

            <Typography variant="h5" component="h2" textAlign="center">
                Recherche d'un adversaire...
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
                Veuillez patienter pendant que nous trouvons le challenger idéal
            </Typography>
        </Box>
    );
};

export default SearchingOpponent;