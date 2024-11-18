import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../../store/authSlice';
import HomeIcon from '@mui/icons-material/Home';
import UserAvatar from "../user/UserAvatar";

const Navbar = ({ subtitle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
          <Typography
            variant="h6"
            component="span"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Home
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="white">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <UserAvatar username={user.username} />
            <Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                onClick={handleMenuOpen}
                sx={{ cursor: 'pointer' }}
              >
                {user.username}
              </Typography>
              <Typography
                variant="body1"
                sx={{ cursor: 'pointer' }}>
                  {user.wallet}$
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;