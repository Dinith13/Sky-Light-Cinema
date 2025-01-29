import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Container, Typography, CircularProgress, Card, CardMedia, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const URL = "http://localhost:4001/movies";

const fetchMovies = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredMovies, setFilteredMovies] = useState([]); // State for filtered movies

  useEffect(() => {
    fetchMovies().then(data => {
      setMovies(data);
      setFilteredMovies(data); // Initialize with all movies
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching movies:", error);
      setLoading(false);
    });
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = movies.filter((movie) =>
      // Match only when the first letter of the name or status matches the query
      movie.name.toLowerCase().startsWith(query) ||
      movie.status.toLowerCase().startsWith(query)
    );

    setFilteredMovies(filtered);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />

      {/* Search Bar Section */}
      <Container sx={{ padding: '20px 0' }}>
        <TextField
          fullWidth
          label="Search Movies"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginBottom: '20px' }}
        />
      </Container>

      <Container sx={{ padding: '40px 0' }}>
        {/* Now Showing Section */}
        <Typography variant="h4" align="left" gutterBottom sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Now Showing!
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '40px' }} />
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            style={{ padding: '20px 0' }} // Added padding for Swiper for better spacing
          >
            {filteredMovies
              .filter(item => item.status === 'available') // Filter for available movies
              .map(item => (
                <SwiperSlide key={item._id}>
                  <Card
                    sx={{
                      width: '240px', // Fixed width for consistency
                      height: '400px', // Fixed height to maintain uniformity
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      margin: '0 auto' // Center cards inside Swiper
                    }}
                  >
                    <Link to={`/movies/${item._id}`} style={{ textDecoration: 'none' }}>
                      <CardMedia
                        component="img"
                        alt={item.name}
                        height="300" // Fixed height for the image
                        image={item.image || 'http://localhost:5173/src/Components/Images/3.png'}
                        title={item.name}
                        sx={{ objectFit: 'cover' }} // Ensure image is contained within fixed size
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
                          IMDB Rate: {item.rate}
                        </Typography>
                      </CardContent>
                    </Link>
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </Container>

      {/* Upcoming Movies Section */}
      <Container sx={{ padding: '40px 0' }}>
        <Typography variant="h4" align="left" gutterBottom sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Upcoming Movies
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '40px' }} />
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            style={{ padding: '20px 0' }}
          >
            {movies
              .filter(item => item.status === 'Up Coming!') // Filter for upcoming movies
              .map(item => (
                <SwiperSlide key={item._id}>
                  <Card
                    sx={{
                      width: '240px',
                      height: '400px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      margin: '0 auto'
                    }}
                  >
                    <Link to={`/movies/${item._id}`} style={{ textDecoration: 'none' }}>
                      <CardMedia
                        component="img"
                        alt={item.name}
                        height="300"
                        image={item.image || 'http://localhost:5173/src/Components/Images/3.png'}
                        title={item.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
                          IMDB Rate: {item.rate}
                        </Typography>
                      </CardContent>
                    </Link>
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </Container>

      <Footer />
    </div>
  );
}

export default MoviePage;
