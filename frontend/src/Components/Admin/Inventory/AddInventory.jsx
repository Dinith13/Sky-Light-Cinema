import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/inventory";

function AddInventory({ onBack }) {
  const [formData, setFormData] = useState({
    ItemName: '',
    type: '',
    MaintananceID: '',
    Cost: '',
    Date: '',
    Note: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if required fields are filled
    if (!formData.ItemName || !formData.type || !formData.MaintananceID || !formData.Cost || !formData.Date) {
      setError('All fields except Note are required.');
      setLoading(false);
      return;
    }

    // Validate the date
    const selectedDate = new Date(formData.Date);
    const currentDate = new Date();
    
    // Set current date to the beginning of the day for comparison
    currentDate.setHours(0, 0, 0, 0);
    
    if (selectedDate <= currentDate) {
      setError('The date must be in the future.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(URL, formData);
      if (response.status === 201) {
        alert('Inventory added successfully');
        // Reset form
        setFormData({
          ItemName: '',
          type: '',
          MaintananceID: '',
          Cost: '',
          Date: '',
          Note: '',
        });
        navigate('/admindashboard/inventory-management');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred while adding the inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Maintenance
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          name="ItemName"
          variant="outlined"
          value={formData.ItemName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Type"
          name="type"
          variant="outlined"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Maintenance ID"
          name="MaintananceID"
          variant="outlined"
          value={formData.MaintananceID}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Cost"
          name="Cost"
          variant="outlined"
          type="number"
          value={formData.Cost}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          name="Date"
          variant="outlined"
          type="date"
          value={formData.Date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0], // Prevent past dates
          }}
        />
        <TextField
          label="Note"
          name="Note"
          variant="outlined"
          value={formData.Note}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Inventory'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={onBack}
          >
            Back
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default AddInventory;
