/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/payment";

function UpdatePayment() {
  const { id } = useParams(); // Using "id" for payment identification
  const [payment, setPayment] = useState({
    paymentId: '',
    amount: '',
    method: '',
    status: 'pending',
    transactionDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching payment with ID:", id);
    const fetchPayment = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        console.log("Fetched payment data:", response.data);
        setPayment(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${id}`, payment);
      alert('Payment updated successfully');
      navigate('/admindashboard/payment-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Payment</Typography>
      <TextField
        label="Payment ID"
        name="paymentId"
        value={payment.paymentId}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Amount"
        name="amount"
        type="number"
        value={payment.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Payment Method"
        name="method"
        value={payment.method}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Transaction Date"
        name="transactionDate"
        type="date"
        value={payment.transactionDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: getTodayDate(), // Set minimum date to today
        }}
      />
      <TextField
        label="Status"
        name="status"
        select
        SelectProps={{ native: true }}
        value={payment.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Payment
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdatePayment;
