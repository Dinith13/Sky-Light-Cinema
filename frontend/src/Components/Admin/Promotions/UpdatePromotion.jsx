import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/promotions";

function UpdatePromotion() {
  const { id } = useParams();
  const [promotion, setPromotion] = useState({
    PROMOID: '',
    title: '',
    description: '',
    discountPercentage: '',
    validFrom: '',
    validTo: '',
    paymentMethods: '' // New field for payment methods
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setPromotion(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching promotion:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${id}`, promotion);
      alert('Promotion updated successfully');
      navigate('/admindashboard/promotion-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Promotion</Typography>
      <TextField
        label="Title"
        name="title"
        value={promotion.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={promotion.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Discount Percentage"
        name="discountPercentage"
        type="number"
        value={promotion.discountPercentage}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Valid From"
        name="validFrom"
        type="date"
        value={promotion.validFrom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Valid To"
        name="validTo"
        type="date"
        value={promotion.validTo}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      {/* New input for Payment Methods */}
      <TextField
        label="Payment Methods"
        name="paymentMethods"
        value={promotion.paymentMethods}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Comma-separated (e.g., Visa, MasterCard, PayPal)"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Promotion
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdatePromotion;
