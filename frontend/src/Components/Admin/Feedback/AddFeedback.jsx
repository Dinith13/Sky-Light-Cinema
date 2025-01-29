import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/feedback";

function AddFeedback({ onBack }) {
  const [feedback, setFeedback] = useState({
    feedbackId: '',
    customerId: '',
    movieId: '',
    rating: 1,
    comment: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(URL, feedback);
      alert('Feedback added successfully');
      navigate('/admindashboard/feedback-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Feedback
      </Typography>
      <form onSubmit={handleSubmit}>
       
        <TextField
          label="Customer ID"
          name="customerId"
          value={feedback.customerId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Movie ID"
          name="movieId"
          value={feedback.movieId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rating"
          type="number"
          name="rating"
          value={feedback.rating}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 5 }}
        />
        <TextField
          label="Comment"
          name="comment"
          value={feedback.comment}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Feedback
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

export default AddFeedback;
