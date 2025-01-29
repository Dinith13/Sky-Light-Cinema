/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/suppliers";

function UpdateSupplier() {
    const { id } = useParams();
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
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${URL}/${id}`)
            .then(response => {
                setFormData(response.data);
            })
            .catch(error => {
                console.error("Error fetching supplier:", error.response ? error.response.data : error.message);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URL}/${id}`, formData);
            navigate('/admindashboard');
        } catch (error) {
            console.error("Error updating supplier:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Update Supplier</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="SupOrderID"
                    name="SupOrderID"
                    variant="outlined"
                    fullWidth
                    value={formData.SupOrderID}
                    onChange={handleChange}
                    margin="normal"
                    disabled
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
                <TextField
                    label="Status"
                    name="status"
                    variant="outlined"
                    fullWidth
                    value={formData.status}
                    onChange={handleChange}
                    margin="normal"
                />
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
                    Update Supplier
                </Button>
            </form>
        </Box>
    );
}

export default UpdateSupplier;
