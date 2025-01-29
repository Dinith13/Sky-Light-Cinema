/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Select, MenuItem, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/bookings";

function UpdateBooking() {
    const { id } = useParams();
    const [booking, setBooking] = useState({
        BookingId: '',
        count: '',
        movieId: '',
        showTimeId: '',
        date: '',
        seat: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Available show times
    const availableShowTimes = ["10:30", "12:30", "14:30", "16:30", "19:30", "22:00"];

    // Get current date and time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Current time in HH:mm format
    const currentDate = now.toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`${URL}/${id}`);
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking:", error);
                setError(error.response ? error.response.data.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${URL}/${id}`, booking);
            alert('Booking updated successfully');
            navigate('/admindashboard/booking-management'); // Adjust the route as necessary
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Update Booking</Typography>
            <TextField
                label="Booking ID"
                name="BookingId"
                value={booking.BookingId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled // Booking ID shouldn't be editable
            />
            <TextField
                label="Count"
                name="count"
                value={booking.count}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number" // Set to number type to restrict input
                inputProps={{ min: 1 }} // Ensure minimum value
            />
            <TextField
                label="Movie ID"
                name="movieId"
                value={booking.movieId}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Select
                label="Show Time"
                name="showTimeId" // Ensure to set the name to map correctly
                variant="outlined"
                value={booking.showTimeId}
                onChange={handleChange} // Use handleChange to update state
                fullWidth
                sx={{ marginBottom: 3 }}
            >
                {/* Only include future times based on the selected date */}
                {booking.date === currentDate ? (
                    availableShowTimes.filter(time => time > currentTime).map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))
                ) : (
                    availableShowTimes.map(time => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))
                )}
            </Select>

            <TextField
                label="Date"
                variant="outlined"
                type="date"
                name="date" // Ensure to set the name to map correctly
                value={booking.date ? new Date(booking.date).toISOString().split('T')[0] : ''} // Format for the date input
                onChange={handleChange} // Corrected to call handleChange directly
                margin="normal"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{ marginBottom: 3 }}
                inputProps={{
                    min: currentDate // Set minimum date to today
                }}
            />

            <Select
                label="Seat Type"
                name="seat" // Ensure to set the name to map correctly
                variant="outlined"
                value={booking.seat}
                onChange={handleChange} // Use handleChange to update state
                fullWidth
                sx={{ marginBottom: 3 }}
            >
                <MenuItem value="">Select Seat Type</MenuItem> {/* Default selection */}
                <MenuItem value="luxury">Luxury</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
            </Select>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ marginTop: 2 }}
            >
                Update Booking
            </Button>
            {error && (
                <Typography color="error" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}

export default UpdateBooking;
