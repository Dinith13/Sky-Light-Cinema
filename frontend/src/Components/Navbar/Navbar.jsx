import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext'; // Adjust the path as needed

function Navbar() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = authState;

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#161516' }}>
        <Toolbar>
          {/* Navbar Items */}
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'red' }} >
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/Movie">Movie</Button>
            <Button color="inherit" component={Link} to="/Buy">Buy Ticket</Button>
            <Button color="inherit" component={Link} to="/promotions">Promotions</Button>
            <Button color="inherit" component={Link} to="/About">About Us</Button>
            <Button color="inherit" component={Link} to="/Contact">Contact Us</Button>
          </Typography>

          {/* Right Side Items */}
          
          {user ? (
            <>
              <Typography variant="body1" sx={{ mx: 2, color: 'red' }}>
                Hello, {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout} sx={{ mx: 2, color: 'red' }}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ mx: 2, color: 'red' }}>Sign In</Button>
              <Button color="inherit" component={Link} to="/signup" sx={{ mx: 2, color: 'red' }}>Sign Up</Button>
              </>
          )}
          </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
