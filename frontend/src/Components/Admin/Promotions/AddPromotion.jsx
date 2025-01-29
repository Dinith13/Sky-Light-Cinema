/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/promotions";

// List of available payment methods
const paymentMethodOptions = ['Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'UPI'];

function AddPromotion({ onBack }) {
  const [promotion, setPromotion] = useState({
    PROMOID: '',
    title: '',
    description: '',
    discountPercentage: '',
    validFrom: '',
    validTo: '',
    paymentMethods: [] // Add paymentMethods field
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handlePaymentMethodChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add the payment method if checked
      setPromotion(prev => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, value]
      }));
    } else {
      // Remove the payment method if unchecked
      setPromotion(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(method => method !== value)
      }));
    }
  };
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts date in 'YYYY-MM-DD' format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await axios.post(URL, promotion);
      alert('Promotion added successfully');
      navigate('/admindashboard/promotion-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Promotion
      </Typography>
      <form onSubmit={handleSubmit}>
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
          value={promotion.discountPercentage}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
         <TextField
        label="Valid From"
        name="validFrom"
        value={promotion.validFrom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: getTodayDate(), // Enforces only future dates
        }}
      />
      <TextField
        label="Valid To"
        name="validTo"
        value={promotion.validTo}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: promotion.validFrom || getTodayDate(), // Enforces valid "To" date only after "From" date
        }}
      />

        {/* Payment Methods Section */}
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Select Payment Methods
        </Typography>
        <FormGroup>
          {paymentMethodOptions.map((method) => (
            <FormControlLabel
              key={method}
              control={
                <Checkbox
                  value={method}
                  checked={promotion.paymentMethods.includes(method)}
                  onChange={handlePaymentMethodChange}
                />
              }
              label={method}
            />
          ))}
        </FormGroup>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Promotion
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2, marginLeft: 2 }}
          onClick={onBack}
        >
          Back
        </Button>
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default AddPromotion;
