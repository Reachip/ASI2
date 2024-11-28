import React from 'react';
import { Card, CardContent, Typography, Box, Paper, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const CardPreview = ({ card, label, color = 'primary', onAction }) => {
    if (!card) return null;

    const isZeroHP = card.hp === 0;

    return (
        <Paper
            sx={{
                maxWidth: 500,
                margin: 'auto',
                aspectRatio: '3/4',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                filter: isZeroHP ? 'grayscale(100%)' : 'none', // Apply grayscale if HP is 0
            }}
        >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FavoriteIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{card.hp}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'center' }}>{card.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlashOnIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{card.energy}</Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: 'grey.200',
                        margin: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={card.imgUrl}
                        alt={`${card.name}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isZeroHP ? 'grayscale(100%)' : 'none', // Apply grayscale to the image if HP is 0
                        }}
                    />
                </Box>
                <Box sx={{ px: 1, py: 0.5 }}>
                    <Typography variant="caption">{card.description}</Typography>
                </Box>
                <CardContent sx={{ mt: 'auto', p: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WhatshotIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{card.attack} attack</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FavoriteIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{card.hp} hp</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SecurityIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{card.defence} defense</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FlashOnIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{card.energy} energy</Typography>
                        </Box>
                    </Box>
                </CardContent>
                {label && (
                    <Box sx={{ p: 1 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color={color}
                            onClick={() => onAction && onAction(card)}
                        >
                            {label}
                        </Button>
                    </Box>
                )}
            </Card>
        </Paper>
    );
};

export default CardPreview;
