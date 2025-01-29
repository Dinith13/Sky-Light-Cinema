import React, { useState } from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats

  // Example seat layout (you can modify it to match your actual layout)
  const seatLayout = [
    ['L10', 'L11', 'L12', 'L13'],
    ['K10', 'K11', 'K12'],
    ['J8', 'J9'],
    ['I4', 'I5', 'I14', 'I15'],
    ['H17'],
    ['G11', 'G12', 'G14', 'G17'],
    ['F11', 'F12', 'F14', 'F15', 'F16'],
  ];

  // Handle seat selection/deselection
  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat)); // Deselect seat
    } else {
      setSelectedSeats([...selectedSeats, seat]); // Select seat
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Your Seats
      </Typography>

      {/* Grid layout to display seats */}
      <Grid container spacing={2}>
        {seatLayout.map((row, rowIndex) => (
          <Grid key={rowIndex} container item spacing={1}>
            {row.map((seat) => (
              <Grid item key={seat}>
                <Button
                  variant={selectedSeats.includes(seat) ? 'contained' : 'outlined'}
                  color={selectedSeats.includes(seat) ? 'primary' : 'default'}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* Display selected seats */}
      <Box mt={3}>
        <Typography variant="h6">Selected Seats: {selectedSeats.join(', ') || 'None'}</Typography>
      </Box>
    </Box>
  );
};

export default SeatSelection;
