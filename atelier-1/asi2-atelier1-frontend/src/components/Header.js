import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container } from '@mui/material';
import { Home as HomeIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material'; // Import fusionné
import { Link } from 'react-router-dom';

const Header = ({ title, subtitle, icon }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar>
                    {icon && (
                        <IconButton edge="start" color="inherit" aria-label="icon">
                            <HomeIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {title}
                        <Typography variant="subtitle1">{subtitle}</Typography>
                    </Typography>

                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/buy">Buy</Button>
                    <Button color="inherit" component={Link} to="/sell">Sell</Button>
                    <Button color="inherit" component={Link} to="/create-user">User Form</Button>

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuOpen}
                        aria-controls="user-menu"
                        aria-haspopup="true"
                    >
                        <AccountCircleIcon />
                    </IconButton>

                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;