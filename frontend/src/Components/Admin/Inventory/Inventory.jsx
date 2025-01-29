/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/inventory";

function Inventory() {
  const { id } = useParams();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory details:', error);
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!inventory) return <Typography>No inventory found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">ID: {inventory.InvID}</Typography>
        <Typography variant="h6">Item Name: {inventory.ItemName}</Typography>
        <Typography variant="h6">Type: {inventory.type}</Typography>
        <Typography variant="h6">Maintanance ID: {inventory.MaintananceID}</Typography>
        <Typography variant="h6">Cost: ${inventory.Cost}</Typography>
        <Typography variant="h6">Date: {new Date(inventory.Date).toLocaleDateString()}</Typography>
        <Typography variant="h6">Note: {inventory.Note || 'No Note'}</Typography>
      </Paper>
    </Box>
  );
}

export default Inventory;
