/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/feedback";

function UpdateFeedback() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState({
    feedbackId: '',
    customerId: '',
    movieId: '',
    rating: 1,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setFeedback(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${id}`, feedback);
      alert('Feedback updated successfully');
      navigate('/admindashboard/feedback-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Feedback</Typography>
      <TextField
        label="Feedback ID"
        name="feedbackId"
        value={feedback.feedbackId}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
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
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Feedback
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdateFeedback;
