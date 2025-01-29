import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/inventory";

function UpdateInventory() {
  const { id } = useParams();
  const [inventory, setInventory] = useState({
    ItemName: '',
    type: '',
    MaintananceID: '',
    Cost: '',
    Date: '',
    Note: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory({ ...inventory, [name]: value });
  };

  const handleUpdate = async () => {
    // Validate that the date is in the future
    const selectedDate = new Date(inventory.Date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to the start of the day

    if (selectedDate <= currentDate) {
      setError('The date must be in the future.');
      return;
    }

    try {
      await axios.put(`${URL}/${id}`, inventory);
      alert('Inventory updated successfully');
      navigate('/admindashboard/inventory-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Inventory</Typography>
      <TextField
        label="Item Name"
        name="ItemName"
        value={inventory.ItemName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Type"
        name="type"
        value={inventory.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Maintenance ID"
        name="MaintananceID"
        value={inventory.MaintananceID}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cost"
        name="Cost"
        type="number"
        value={inventory.Cost}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        name="Date"
        type="date"
        value={inventory.Date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{
          min: new Date().toISOString().split('T')[0], // Prevent past dates
        }}
      />
      <TextField
        label="Note"
        name="Note"
        value={inventory.Note}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Inventory
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdateInventory;
