/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/feedback";

function Feedback() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setFeedback(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback details:', error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!feedback) return <Typography>No feedback found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Feedback Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">Feedback ID: {feedback.feedbackId}</Typography>
        <Typography variant="h6">Customer ID: {feedback.customerId}</Typography>
        <Typography variant="h6">Jewellery ID: {feedback.jewelleryId}</Typography>
        <Typography variant="h6">Rating: {feedback.rating}</Typography>
        <Typography variant="h6">Comment: {feedback.comment}</Typography>
      </Paper>
    </Box>
  );
}

export default Feedback;
