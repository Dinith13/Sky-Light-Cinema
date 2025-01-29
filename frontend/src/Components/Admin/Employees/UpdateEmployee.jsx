import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

// Background image URL
const backgroundImage = 'https://adornabrid.com/cdn/shop/products/2019-08-2209.01.16_8c8cfb38-f411-4564-9dbf-2e7c43b42d91.jpg?v=1639536050&width=1426';
const URL = "http://localhost:4001/employees";
const GET_URL = "http://localhost:4001/employees"; // Endpoint to get existing employees

const styles = {
  container: {
    position: 'relative',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(3px)',
    zIndex: 0,
  },
};

function UpdateEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    EMPID: '',
    name: '',
    email: '',
    position: '',
    phone: '',
    address: '',
    salary: '',
    oldPhone: '' // Store the old phone number for validation
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [existingPhones, setExistingPhones] = useState([]); // State to hold existing phone numbers
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setEmployee({ ...response.data, oldPhone: response.data.phone }); // Store old phone for later comparison
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    const fetchExistingEmployees = async () => {
      try {
        const response = await axios.get(GET_URL);
        const phones = response.data.map(emp => emp.phone); // Extract phone numbers
        setExistingPhones(phones);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployee();
    fetchExistingEmployees();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });

    // Reset error messages when the user starts typing
    if (name === 'name') setNameError('');
    if (name === 'email') setEmailError('');
    if (name === 'phone') setPhoneError('');
  };

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const handleUpdate = async () => {
    setError(null);
    setNameError('');
    setEmailError('');
    setPhoneError('');

    // Check for name validation
    if (!validateName(employee.name)) {
      setNameError('Name cannot contain numbers or special characters');
      return;
    }

    // Check for email validation
    if (!validateEmail(employee.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check for phone validation
    if (!validatePhone(employee.phone)) {
      setPhoneError('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    // Check for duplicate phone numbers, excluding the current employee's old phone
    const phoneExists = existingPhones.includes(employee.phone) && employee.phone !== employee.oldPhone; 
    if (phoneExists) {
      setPhoneError('This phone number is already in use');
      return;
    }

    try {
      await axios.put(`${URL}/${id}`, employee);
      alert('Employee updated successfully');
      navigate('/admindashboard/employee-details');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.backgroundImage} />
      <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 1,
        padding: 3,
        width: '600px',
        zIndex: 1,
        marginTop: 5
      }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Update Employee
        </Typography><br />
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
        /><br />
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
          >
            Update Employee
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ marginTop: 3 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default UpdateEmployee;
