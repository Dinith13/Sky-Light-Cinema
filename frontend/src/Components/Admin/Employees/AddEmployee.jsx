/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/employees/create";
const GET_URL = "http://localhost:4001/employees"; // Endpoint to get existing employees

function AddEmployee({ onBack }) {
  const [employee, setEmployee] = useState({
    EMPID: '',
    name: '',
    email: '',
    position: '',
    phone: '',
    address: '',
    salary: ''
  });

  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [existingPhones, setExistingPhones] = useState([]); // State to hold existing phone numbers

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing employees to check for duplicates
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(GET_URL);
        const phones = response.data.map(emp => emp.phone); // Extract phone numbers
        setExistingPhones(phones);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for salary
    if (name === 'salary' && !/^\d*\.?\d*$/.test(value)) {
      return; // Ignore non-numeric input
    }

    setEmployee({ ...employee, [name]: value });

    // Clear specific error messages on change
    if (name === 'name') setNameError('');
    if (name === 'email') setEmailError('');
    if (name === 'phone') setPhoneError('');
    if (name === 'salary') setSalaryError('');
  };

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const validateSalary = (salary) => {
    const num = parseFloat(salary);
    return !isNaN(num) && num >= 0; // Salary must be a positive number
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setSalaryError('');

    if (!validateName(employee.name)) {
      setNameError('Name cannot contain numbers or special characters');
      return;
    }

    if (!validateEmail(employee.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!validatePhone(employee.phone)) {
      setPhoneError('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    if (existingPhones.includes(employee.phone)) {
      setPhoneError('This phone number is already in use');
      return;
    }

    if (!validateSalary(employee.salary)) {
      setSalaryError('Salary must be a positive number');
      return;
    }

    try {
      await axios.post(URL, employee);
      alert('Employee added successfully');
      navigate('/admindashboard/employee-details');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          padding: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 1,
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add New Employee
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!nameError}
            helperText={nameError}
          />
          <TextField
            label="Email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!emailError}
            helperText={emailError}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              name="position"
              value={employee.position}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="Cinema Manager">Cinema Manager</MenuItem>
              <MenuItem value="Assistant Manager">Assistant Manager</MenuItem>
              <MenuItem value="Ticketing Officer">Ticketing Officer</MenuItem>
              <MenuItem value="Customer Service Representative">Customer Service Representative</MenuItem>
              <MenuItem value="Concessions Staff">Concessions Staff</MenuItem>
              <MenuItem value="Projectionist">Projectionist</MenuItem>
              <MenuItem value="Usher">Usher</MenuItem>
              <MenuItem value="Marketing Coordinator">Marketing Coordinator</MenuItem>
              <MenuItem value="Operations Manager">Operations Manager</MenuItem>
              <MenuItem value="Event Coordinator">Event Coordinator</MenuItem>
              <MenuItem value="Cleaning Staff">Cleaning Staff</MenuItem>
              <MenuItem value="Security Officer">Security Officer</MenuItem>
              <MenuItem value="Technical Support">Technical Support</MenuItem>
              <MenuItem value="Sound/Lighting Technician">Sound/Lighting Technician</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!phoneError}
            helperText={phoneError}
          />
          <TextField
            label="Address"
            name="address"
            value={employee.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={employee.salary}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ borderRadius: 1 }}
            error={!!salaryError}
            helperText={salaryError}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '200px' }}
            >
              Add Employee
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onBack}
              sx={{ width: '200px', marginLeft: 2 }}
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
    </Box>
  );
}

export default AddEmployee;
