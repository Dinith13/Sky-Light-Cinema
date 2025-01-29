/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/suppliers";

function AddSupplier({ onBack }) {
    const [formData, setFormData] = useState({
        SupOrderID: '',
        type: '',
        quantity: '',
        InvID: '',
        JID: '',
        SupID: '',
        status: 'Pending',
        date: '',
        description: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, ] = useState('');
    const [snackbarSeverity,] = useState('success');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting form data:', formData); // Log form data for debugging
            const response = await axios.post(URL, {
                ...formData,
                date: new Date(formData.date).toISOString() // Convert date to ISO string
            });
            console.log('Response from server:', response.data); // Log server response
            // Show alert on successful addition
            alert('Supplier order added successfully');
            // Redirect after a short delay
            setTimeout(() => navigate('/admindashboard/supplier-management'), 2000);
        } catch (error) {
            console.error("Error adding supplier:", error.response ? error.response.data : error.message);
            // Show alert on error
            alert('Error adding supplier: ' + (error.response ? error.response.data.message : error.message));
        }
    };
    

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Add Supplier</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="SupOrderID"
                    name="SupOrderID"
                    variant="outlined"
                    fullWidth
                    value={formData.SupOrderID}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Type"
                    name="type"
                    variant="outlined"
                    fullWidth
                    value={formData.type}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={formData.quantity}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="InvID"
                    name="InvID"
                    variant="outlined"
                    fullWidth
                    value={formData.InvID}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="JID"
                    name="JID"
                    variant="outlined"
                    fullWidth
                    value={formData.JID}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="SupID"
                    name="SupID"
                    variant="outlined"
                    fullWidth
                    value={formData.SupID}
                    onChange={handleChange}
                    margin="normal"
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    value={formData.date}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Add Supplier
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onBack}
                    sx={{ marginTop: 2, marginLeft: 2 }}
                >
                    Back
                </Button>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AddSupplier;
