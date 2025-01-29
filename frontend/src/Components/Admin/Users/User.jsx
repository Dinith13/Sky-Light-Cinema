import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/users";

function User() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${URL}/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Details
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h6">ID: {user.userId}</Typography>
                <Typography variant="h6">Username: {user.userName}</Typography>
                <Typography variant="h6">Name: {user.name}</Typography>
                <Typography variant="h6">Email: {user.email}</Typography>
                <Typography variant="h6">Phone: {user.phone}</Typography>
                <Typography variant="h6">Type: {user.type}</Typography>
            </Paper>
        </Box>
    );
}

export default User;
