/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/movies";

function Movie() {
  const { id } = useParams(); // Changed MID to id
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!movie) return <Typography>No movie found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
      Movie Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">ID: {movie.MID}</Typography>
        <Typography variant="h6">Image:</Typography>
        <img src={movie.image || 'default-image-path'} alt={movie.name} style={{ width: '150px', height: '150px' }} />
        <Typography variant="h6">Name: {movie.name}</Typography>
        <Typography variant="h6">Rating: ${movie.rate}</Typography>
        <Typography variant="h6">Description: {movie.description}</Typography>
        <Typography variant="h6">Status: {movie.status}</Typography>
      </Paper>
    </Box>
  );
}

export default Movie;
