/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Description } from '@mui/icons-material';

const URL = "http://localhost:4001/movies";

function UpdateMovie() {
  const { MID } = useParams();
  const [movie, setMovie] = useState({
    image: '',
    name: '',
    rate: '',
    description: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching movie with MID:", MID);
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${URL}/${MID}`);
        console.log("Fetched movie data:", response.data);
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [MID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${MID}`, movie);
      alert('Movie updated successfully');
      navigate('/admindashboard/movie-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Movie</Typography>
      <TextField
        label="Image URL"
        name="image"
        value={movie.image}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        name="name"
        value={movie.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ratings"
        name="price"
        type="number"
        value={movie.rate}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="quantity"
        value={movie.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Status"
        name="status"
        select
        SelectProps={{ native: true }}
        value={movie.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <option value="Now Showing!">Now Showing!</option>
        <option value="Up Coming!">Up Coming!</option>
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Movie
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdateMovie;
