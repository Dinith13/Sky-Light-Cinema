/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import Header from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

function AboutUs() {
  return (
    <div>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {/* Main Header */}
        <Typography variant="h3" align="center" gutterBottom>
          About Sky Light Cinema
        </Typography>

        {/* Introduction Section */}
        <Typography variant="body1" paragraph align="center" sx={{ marginBottom: 4 }}>
          Welcome to Sky Light Cinema, your ultimate destination for unforgettable cinematic experiences. 
          Whether you're a movie enthusiast or just looking for a fun night out, we offer the perfect blend of entertainment, comfort, and technology.
        </Typography>

        {/* Our Mission Section */}
        <Typography variant="h4" gutterBottom align="center">
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph align="center">
          At Sky Light Cinema, we are committed to delivering exceptional movie experiences through cutting-edge technology, 
          superior customer service, and a passion for great films. We aim to create a space where movie lovers can gather, 
          share their love for cinema, and be immersed in stories that inspire and entertain.
        </Typography>

        {/* Core Values Section */}
        <Box sx={{ marginTop: 6, marginBottom: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Our Core Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Value 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body2">
                  We embrace the latest in cinema technology, from high-definition screens to immersive sound systems, 
                  ensuring our audience experiences movies in the best possible way.
                </Typography>
              </Paper>
            </Grid>

            {/* Value 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Customer Experience
                </Typography>
                <Typography variant="body2">
                  Our customers are our top priority. From the moment you walk in, we ensure a seamless and enjoyable experience, 
                  from ticketing to concessions, to the comfort of our theaters.
                </Typography>
              </Paper>
            </Grid>

            {/* Value 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Community Engagement
                </Typography>
                <Typography variant="body2">
                  We believe in giving back to the community. Sky Light Cinema actively supports local filmmakers, hosts community events, 
                  and fosters a culture of creativity and connection through the magic of movies.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* History Section */}
        <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: 6 }}>
          Our Journey
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Since our inception in 2024, Sky Light Cinema has grown from a single-screen theater to a multi-screen entertainment hub. 
          What started as a dream to bring high-quality cinema to our local community has now expanded into a full-scale operation, 
          offering the latest blockbusters, independent films, and special screenings.
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Through continuous innovation and a commitment to excellence, we strive to provide our customers with the best cinematic experience 
          every time they visit us. We are excited for the future as we continue to evolve and set new standards for movie entertainment.
        </Typography>

        {/* Why Choose Us Section */}
        <Box sx={{ marginTop: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Why Choose Sky Light Cinema?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Cutting-Edge Technology
              </Typography>
              <Typography variant="body1">
                We use the latest in projection and sound technologies, ensuring every movie feels larger than life. 
                Our high-definition screens and state-of-the-art sound systems immerse you fully in the film, making every detail come alive.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Comfort and Convenience
              </Typography>
              <Typography variant="body1">
                Our theaters are designed with your comfort in mind. With spacious, luxurious seating, easy online ticketing, and a wide range of snacks and drinks, 
                Sky Light Cinema offers everything you need for a relaxing and enjoyable movie experience.
              </Typography>
            </Grid>
          </Grid>
        </Box>

      </Container>

      <Footer />
    </div>
  );
}

export default AboutUs;
