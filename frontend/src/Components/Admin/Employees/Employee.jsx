import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4001/employees";

function Employee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setEmployee(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!employee) return <Typography>No employee found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">ID: {employee.EMPID}</Typography>
        <Typography variant="h6">Name: {employee.name}</Typography>
        <Typography variant="h6">Email: {employee.email}</Typography>
        <Typography variant="h6">Position: {employee.position}</Typography>
        <Typography variant="h6">Phone: {employee.phone}</Typography>
        <Typography variant="h6">Address: {employee.address}</Typography>
      </Paper>
    </Box>
  );
}

export default Employee;
