/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AirplaneTicket, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import Navbar from '../Navbar/Navbar'; // Ensure the path is correct
import Footer from '../Footer/Footer'
import backgroundImage1 from '../Images/Rectangle2.png';


function Home() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100); // Delay for initial fade-in effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      margin: 0,
      overflow: 'hidden',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 2s ease-out',
    }}>
      <Navbar /> {/* Include the Navbar component */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${backgroundImage1})`,
          backgroundPosition: 'left center, right center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: '100%,100%',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 2s ease-out',
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h2"
          sx={{
            position: 'absolute',
            color: '#FAF2F2',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '6rem',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '20px',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: fadeIn ? 'translateY(0)' : 'translateY(-50px)',
            opacity: fadeIn ? 1 : 0,
            transition: 'transform 2s ease-out, opacity 2s ease-out',
          }}
        >
          <span style={{ position: 'relative', transition: 'transform 2s ease-out' }}>SKY LIGHT CINEMA</span>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            position: 'absolute',
            color: '#FAF2F2',
            fontFamily: '"Allura", cursive', // Apply the custom font
            fontWeight: 400, // Apply the font weight
            fontStyle: 'normal', // Apply the font style
            marginTop: '50px',
            marginBottom: '-60px',
            textAlign: 'center',
            fontSize: '3rem',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 2s ease-out, opacity 2s ease-out',
          }}
        >
        </Typography>

        {/* Shopping Button */}
        
      </Box>
      <Footer/>

    </div>
  );
}

export default Home;
