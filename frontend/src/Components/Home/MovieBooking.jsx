import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem, Snackbar, Alert, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const URL = "http://localhost:4001/bookings";

const MovieBooking = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [ticketId, setTicketId] = useState('AUTO_GENERATED_ID');
  const [count, setCount] = useState(1);
  const { authState } = useContext(AuthContext);
  const [userId, setUserId] = useState(authState.user?.id || 'AUTO_FILLED_USER_ID');
  const [showTimeId, setShowTimeId] = useState('10:30');
  const [date, setDate] = useState('');
  const [seat, setSeat] = useState('select');
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
    fetchMovie();
  }, [movieId]);

  const availableShowTimes = ["10:30", "12:30", "14:30", "16:30", "19:30", "22:00"];
  
  // Get current date and time for validation
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Current time in HH:mm format
  const currentDate = now.toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!authState.user) {
      setSnackbarMessage('You need to be logged in to book tickets.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(URL, {
        TicketId: ticketId,
        count: Number(count),
        movieId: movie?.name,  // Send the movie name instead of the ID
        userId,
        showTimeId,
        date,
        seat,
      });
      if (response.status === 201) {
        setSnackbarMessage('Booking added successfully');
        setSnackbarOpen(true);
        // Reset the form after successful booking
        resetForm();
        alert('Complete the Payment to Proceed');
        navigate('/Buy', { state: { bookingDetails: response.data } });
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  const resetForm = () => {
    setCount(1);
    setShowTimeId('10:30');
    setDate('');
    setSeat('select');
    setTicketId('AUTO_GENERATED_ID');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isMovieAvailable = movie && movie.status === 'available'; // Check if the movie is available

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Header />

      <Box sx={{ padding: 4, maxWidth: '1000px', margin: 'auto', backgroundColor: 'white', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Movie Information Section */}
          <Grid item xs={12} md={4}>
            {movie && (
              <Card sx={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <CardMedia
                  component="img"
                  alt={movie.name}
                  height="350"
                  image={movie.image || 'http://localhost:5173/src/Components/Images/3.png'}
                  title={movie.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>{movie.name}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Booking Form Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
              Movie Booking
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ marginBottom: 2 }}>
              Fill in your details below to book tickets for <strong>{movie ? movie.name : 'the movie'}</strong>.
            </Typography>

            {!isMovieAvailable ? ( // Check if the movie is available
              <Typography variant="body1" color="error">
                Sorry, this movie is not available for booking.
              </Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Number of Tickets"
                  variant="outlined"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  margin="normal"
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                  sx={{ marginBottom: 3 }}
                />

                <Select
                  label="Show Time"
                  variant="outlined"
                  value={showTimeId}
                  onChange={(e) => setShowTimeId(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 3 }}
                >
                  {/* Dynamically display available show times based on the selected date */}
                  {availableShowTimes.filter(time => (date === currentDate ? time > currentTime : true)).map(time => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                  ))}
                </Select>

                <TextField
                  label="Date"
                  variant="outlined"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  sx={{ marginBottom: 3 }}
                  inputProps={{
                    min: currentDate // Set minimum date to today
                  }}
                />

                <Select
                  label="Seat Type"
                  variant="outlined"
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 3 }}
                >
                  <MenuItem value="select">Select Seat Type</MenuItem>
                  <MenuItem value="luxury">Luxury</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                </Select>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ padding: '12px 24px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ padding: '12px 24px', fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Box>

                {error && (
                  <Typography color="error" sx={{ marginTop: 2 }}>
                    {error}
                  </Typography>
                )}
              </form>
            )}
          </Grid>
        </Grid>
      </Box>

      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MovieBooking;
