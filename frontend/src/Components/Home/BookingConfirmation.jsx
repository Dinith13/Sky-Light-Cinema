/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingDetails } = location.state || {}; // Destructure the booking details passed via navigation

  if (!bookingDetails) {
    return <Typography variant="h6">No booking details available.</Typography>;
  }

  const { movie, showTimeId, date, seat, count, ticketId } = bookingDetails;

  return (
    <div>
      <Header />

      <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
        <Grid container spacing={3}>
          {/* Movie Information Section */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                alt={movie.name}
                height="300"
                image={movie.image || 'http://localhost:5173/src/Components/Images/3.png'}
                title={movie.name}
              />
              <CardContent>
                <Typography variant="h5">{movie.name}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Information Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Booking Confirmation
            </Typography>

            <Card>
              <CardContent>
                <Typography variant="h6">
                  Ticket ID: <strong>{ticketId}</strong>
                </Typography>
                <Typography variant="h6">
                  Movie: <strong>{movie.name}</strong>
                </Typography>
                <Typography variant="h6">
                  Show Time: <strong>{showTimeId}</strong>
                </Typography>
                <Typography variant="h6">
                  Date: <strong>{date}</strong>
                </Typography>
                <Typography variant="h6">
                  Seats: <strong>{seat}</strong>
                </Typography>
                <Typography variant="h6">
                  Ticket Count: <strong>{count}</strong>
                </Typography>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
