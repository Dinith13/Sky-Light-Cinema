import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/promotions";

function Promotion() {
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setPromotion(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching promotion details:', error);
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!promotion) return <Typography>No promotion found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Promotion Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">ID: {promotion.PROMOID}</Typography>
        <Typography variant="h6">Title: {promotion.title}</Typography>
        <Typography variant="h6">Description: {promotion.description}</Typography>
        <Typography variant="h6">Discount Percentage: {promotion.discountPercentage}%</Typography>
        <Typography variant="h6">Valid From: {new Date(promotion.validFrom).toLocaleDateString()}</Typography>
        <Typography variant="h6">Valid To: {new Date(promotion.validTo).toLocaleDateString()}</Typography>

        {/* Display Payment Methods */}
        <Typography variant="h6" sx={{ marginTop: 2 }}>Payment Methods:</Typography>
        {promotion.paymentMethods && promotion.paymentMethods.length > 0 ? (
          <Box component="ul" sx={{ marginLeft: 2 }}>
            {promotion.paymentMethods.map((method, index) => (
              <Typography component="li" key={index}>{method}</Typography>
            ))}
          </Box>
        ) : (
          <Typography>No payment methods available for this promotion.</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Promotion;
