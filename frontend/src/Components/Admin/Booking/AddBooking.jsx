/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/bookings";

// eslint-disable-next-line react/prop-types
function AddBooking({ onBack }) {
  const [TicketId, setTicketId] = useState('');
  const [count, setCount] = useState(1); // Default to 1
  const [movieId, setMovieId] = useState('');
  const [userId, setUserId] = useState('');
  const [showTimeId, setShowTimeId] = useState('10:30'); // Default to '10:30'
  const [date, setDate] = useState('');
  const [seat, setSeat] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post(URL, { 
        TicketId, 
        count: Number(count), // Convert to number
        movieId, 
        userId, 
        showTimeId, 
        date, 
        seat 
      });
      if (response.status === 201) {
        alert('Booking added successfully');
        navigate('/admindashboard/booking-management');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Booking
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ticket ID"
          variant="outlined"
          value={TicketId}
          onChange={(e) => setTicketId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Count"
          variant="outlined"
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Movie ID"
          variant="outlined"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="User ID"
          variant="outlined"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Show Time"
          variant="outlined"
          select
          SelectProps={{ native: true }}
          value={showTimeId}
          onChange={(e) => setShowTimeId(e.target.value)}
          fullWidth
          margin="normal"
        >
          <option value="10:30">10:30</option>
          <option value="13:30">13:30</option>
          <option value="16:30">16:30</option>
        </TextField>
        <TextField
          label="Date"
          variant="outlined"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          label="Seat"
          variant="outlined"
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Booking
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2, marginLeft: 2 }}
          onClick={onBack}
        >
          Back
        </Button>
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default AddBooking;
