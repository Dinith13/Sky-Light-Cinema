import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Button, Grid, Card, CardMedia, CardContent, Box, 
  Snackbar, Alert, IconButton, Rating, CardActions 
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AddFeedback from '../Admin/Feedback/AddFeedback2';
import { AuthContext } from '../Auth/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookIcon from '@mui/icons-material/Book';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const MovieProfile = () => {
  const [movie, setMovie] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const { id: movieId } = useParams();
  const [noResults, setNoResults] = useState(false);
  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);
  const [images, setImages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const URL = 'http://localhost:4001/feedback';
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4001/movies/${movieId}`)
      .then(response => {
        setMovie(response.data);
        setImages(response.data.images || []);
      })
      .catch(error => console.error('Error fetching movie:', error));
  }, [movieId]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(URL);
        const filteredFeedbacks = response.data.filter(feedback => feedback.movieId === movie.MID);
        setFeedbacks(filteredFeedbacks);
        setNoResults(filteredFeedbacks.length === 0);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    if (movie) {
      fetchFeedbacks();
    }
  }, [movie]);

  const handleBooking = () => {
    if (!authState.user) {
      setSnackbarMessage('You need to be logged in to Book Movies.');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Movie Booking Confirmed!');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRedirectToLogin = () => {
    navigate('/login');
    setSnackbarOpen(false);
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      <Header />
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Movie Poster and Gallery */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <CardMedia
                component="img"
                alt={movie.name}
                height="500"
                image={movie.image || 'http://localhost:5173/src/Components/Images/3.png'}
                title={movie.name}
                sx={{ borderRadius: '10px' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Image ${index}`}
                      style={{ width: '100%', maxWidth: '400px', marginRight: '10px', borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Movie Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              {movie.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {movie.description}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              IMDB Rating: {movie.rate}
            </Typography>
            <Typography variant="h6" sx={{ color: movie.status === 'Available' ? 'green' : 'red', marginBottom: 3 }}>
              {movie.status}
            </Typography>

            {/* Action Buttons */}
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/book/${movie._id}`}
                startIcon={<BookIcon />}
                sx={{ marginRight: 2 }}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to="/Contact"
                startIcon={<ContactSupportIcon />}
              >
                Contact Support
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={() => alert('Added to Favourite!')}
                startIcon={<FavoriteIcon />}
              >
                Add to Favourite
              </Button>
            </CardActions>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowAddFeedbackForm(!showAddFeedbackForm)}
              sx={{ marginTop: 2 }}
            >
              {showAddFeedbackForm ? 'Cancel' : 'Add Feedback'}
            </Button>
          </Grid>
        </Grid>

        {/* Feedback Section */}
        <Box sx={{ marginTop: 5 }}>
          {showAddFeedbackForm ? (
            <AddFeedback movieId={movie.MID} onBack={() => setShowAddFeedbackForm(false)} />
          ) : (
            <Box sx={{ padding: 3 }}>
              {noResults ? (
                <Typography variant="h6" align="center">
                  No feedback found.
                </Typography>
              ) : (
                feedbacks.map((feedback) => (
                  <Card key={feedback._id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        Customer Name: {feedback.customerId}
                      </Typography>
                      <Rating value={feedback.rating} readOnly />
                      <Typography variant="body2">{feedback.comment}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MovieProfile;
