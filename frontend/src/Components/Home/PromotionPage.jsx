import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Container, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs'; // Import dayjs to format dates

const URL = "http://localhost:4001/promotions"; // URL to fetch promotions

const fetchPromotions = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

function PromotionPage() {
  const [promotions, setPromotions] = useState([]); // For storing all promotions
  const [filteredPromotions, setFilteredPromotions] = useState([]); // For filtered search results
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions().then(data => {
      setPromotions(data);
      setFilteredPromotions(data); // Initially show all promotions
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    });
  }, []);

  // Handle search query changes and filter the promotions accordingly
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = promotions.filter(item =>
      Object.values(item).some(field =>
        field && field.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    setFilteredPromotions(filtered);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ padding: '40px 0' }}>
        <Grid container justifyContent="left" alignItems="left" spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item>
            <TextField
              label="Search Promotions"
              variant="outlined"
              value={searchQuery}
              onChange={handleInputChange} // Live search here
              sx={{
                width: '300px',
                backgroundColor: 'white',
                borderRadius: 1,
                padding: '1px',
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ marginRight: 1 }} />
                )
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="h4" align="left" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold' }}>
          Promotions Available!
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '40px' }} />
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
          >
            {filteredPromotions.map(item => (
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
                  <Link
                    to={`/movie`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevents immediate navigation
                      alert(`${item.title} ${item.description} Activated!`); // Show the alert
                      // After the alert, navigate to the link
                      window.location.href = `/movie`;
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={item.title}
                      height="200"
                      image={item.image || 'http://localhost:5173/src/Components/Images/3.png'}
                      title={item.title}
                      sx={{
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                  </Link>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discount: {item.discountPercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiry Date: {dayjs(item.validTo).format('YYYY-MM-DD')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description: {item.description}
                    </Typography>
                  </CardContent>
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

export default PromotionPage;
