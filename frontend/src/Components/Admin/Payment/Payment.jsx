/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/payment";

function Payment() {
  const { id } = useParams(); // Use 'id' for Payment ID
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setPayment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!payment) return <Typography>No payment found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">Payment ID: {payment.PID}</Typography>
        <Typography variant="h6">Amount: ${payment.amount}</Typography>
        <Typography variant="h6">Method: {payment.method}</Typography>
        <Typography variant="h6">Status: {payment.status}</Typography>
        <Typography variant="h6">Transaction Date: {new Date(payment.transactionDate).toLocaleDateString()}</Typography>
      </Paper>
    </Box>
  );
}

export default Payment;
