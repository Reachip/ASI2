import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ScienceIcon from '@mui/icons-material/Science';

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Sell',
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      path: '/sell',
    },
    {
      title: 'Buy',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      path: '/buy',
    },
    {
      title: 'Create',
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      path: '/create',
    },
  ];

  return (
    <Grid container spacing={3}>
      {menuItems.map((item) => (
        <Grid item xs={12} sm={4} key={item.title}> {/* Utilisez sm={4} pour avoir 3 cartes sur la même ligne */}
          <Card
            sx={{
              height: '100%',
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.02)' },
              transition: 'transform 0.2s',
            }}
            onClick={() => navigate(item.path)}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {item.icon}
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default HomePage;
