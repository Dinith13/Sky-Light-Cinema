/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';

const URL = "http://localhost:4001/suppliers";

function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(URL);
        // Convert date strings to Date objects
        const suppliersWithDateObjects = response.data.map(supplier => ({
          ...supplier,
          date: new Date(supplier.date)
        }));
        setSuppliers(suppliersWithDateObjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (suppliers.length === 0) return <Typography>No suppliers found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      {suppliers.map((supplier) => (
        <Paper key={supplier.SupOrderID} sx={{ padding: 3, marginBottom: 2 }}>
          <Typography variant="h6">SupOrderID: {supplier.SupOrderID}</Typography>
          <Typography variant="h6">Type: {supplier.type}</Typography>
          <Typography variant="h6">Quantity: {supplier.quantity}</Typography>
          <Typography variant="h6">InvID: {supplier.InvID}</Typography>
          <Typography variant="h6">JID: {supplier.JID}</Typography>
          <Typography variant="h6">SupID: {supplier.SupID}</Typography>
          <Typography variant="h6">Status: {supplier.status}</Typography>
          <Typography variant="h6">Date: {supplier.date.toISOString()}</Typography>
          <Typography variant="h6">Description: {supplier.description}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default SupplierDetails;
