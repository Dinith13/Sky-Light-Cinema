import React, { useState } from 'react';
import { TextField, Button, Box,Typography } from '@mui/material';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/feedback";

function AddFeedback({ movieId, onBack }) {
  const [feedback, setFeedback] = useState({
    feedbackId: '',
    customerId: '',
    movieId: movieId || '',
    rating: 1,
    comment: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRatingChange = (newRating) => {
    setFeedback({ ...feedback, rating: newRating });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(URL, feedback);
      alert('Feedback added successfully');
      navigate(`../movie/`);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Name"
          name="customerId"
          value={feedback.customerId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Typography >
          Rate This Item
        </Typography>
        <StarRatings
          rating={feedback.rating}
          starRatedColor="gold"
          changeRating={handleRatingChange}
          numberOfStars={5}
          starDimension="30px"
          starSpacing="5px"
          name='rating'
        />
        <TextField
          label="Comment"
          name="comment"
          value={feedback.comment}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Box sx={{ marginTop: 2 }}>
          <Button type="submit" variant="contained" color="primary">Submit Feedback</Button>
          <Button variant="outlined" color="secondary" onClick={onBack} sx={{ marginLeft: 2 }}>Cancel</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddFeedback;
