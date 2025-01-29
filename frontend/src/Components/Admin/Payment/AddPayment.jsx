/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/payment";

// eslint-disable-next-line react/prop-types
function AddPayment({ onBack }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('credit card'); // Default to 'credit card'
  const [status, setStatus] = useState('pending'); // Default to 'pending'
  const [transactionDate, setTransactionDate] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    // Validation for transaction date
    const today = new Date().toISOString().split('T')[0]; // Today's date in 'YYYY-MM-DD' format
    if (!transactionDate) {
      setError('Transaction date is required.');
      return;
    }
    if (transactionDate < today) {
      setError('Transaction date must be today or in the future.');
      return;
    }

    try {
      const response = await axios.post(URL, { amount, method, status, transactionDate });
      if (response.status === 201) {
        alert('Payment added successfully');
        navigate('/admindashboard/payment-management');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Payment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Method"
          variant="outlined"
          select
          SelectProps={{ native: true }}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          fullWidth
          margin="normal"
        >
          <option value="credit card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="bank transfer">Bank Transfer</option>
          <option value="cash">Cash</option>
        </TextField>
        <TextField
          label="Status"
          variant="outlined"
          select
          SelectProps={{ native: true }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </TextField>
        <TextField
          label="Transaction Date"
          variant="outlined"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getTodayDate(), // Set minimum date to today
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Payment
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

export default AddPayment;
