import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddEmployee from './AddEmployee'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/employees";

const fetchEmployees = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [view, setView] = useState('table'); // Toggle between 'table' and 'stats'
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees().then(data => {
      setEmployees(data);
    }).catch(error => {
      console.error("Error fetching employees:", error);
    });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-employee/${id}`);
  };

  const deleteEmployee = async (employee) => {
    try {
      const response = await axios.delete(`${URL}/${employee._id}`);
      if (response.status === 200) {
        setEmployees(prev => prev.filter(emp => emp._id !== employee._id));
        alert(`Employee ${employee.EMPID} (${employee.name}) deleted successfully.`);
      }
    } catch (error) {
      console.error("Error deleting employee:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    if (employees.length === 0) {
      alert("No employee data available to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text("SKY LIGHT CINEMA", 10, 10); // Updated title

    // Add a subtitle or description if needed
    doc.setFontSize(12);
    doc.text("Employee Details Report", 10, 20);

    // Ensure employees data is formatted correctly
    const employeeData = employees.map(employee => [
      employee.EMPID,
      employee.name,
      employee.email,
      employee.position,
      employee.phone,
      employee.address
    ]);

    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Position', 'Phone', 'Address']],
      body: employeeData,
      startY: 30, // Adjusted startY for spacing
      margin: { top: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    // Save the PDF
    doc.save('employee-details.pdf');
  };

  // Handle live search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchEmployees().then(data => {
        setEmployees(data);
        setNoResults(false);
      }).catch(error => {
        console.error("Error fetching employees:", error);
      });
    } else {
      const filteredEmployees = employees.filter(employee =>
        Object.values(employee).some(field =>
          field && field.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
      setEmployees(filteredEmployees);
      setNoResults(filteredEmployees.length === 0);
    }
  };

  const handleAddEmployee = () => {
    setShowAddEmployeeForm(true);
  };

  const handleBack = () => {
    setShowAddEmployeeForm(false);
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const positionDistribution = employees.reduce((acc, employee) => {
    acc[employee.position] = (acc[employee.position] || 0) + 1;
    return acc;
  }, {});

  // Render the statistics view
  const renderStatsView = () => (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>Total Employees: {totalEmployees}</Typography>
      <Typography variant="h6" gutterBottom>Position Distribution:</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(positionDistribution).map(([position, count]) => (
              <TableRow key={position}>
                <TableCell>{position}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Handle view change
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  return (
    <Box>
      {showAddEmployeeForm ? (
        <Box>
          <AddEmployee onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center', marginTop: 4 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch} // Live search
              sx={{
                flexShrink: 1,
                width: '300px', // Increased width for the search bar
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePDF} // Moved PDF download button
              sx={{ borderRadius: 2 }}
            >
              Download Employee Details
            </Button>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              sx={{ marginLeft: 'auto' }}
            >
              <ToggleButton value="table">Table View</ToggleButton>
              <ToggleButton value="stats">Stats View</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
              sx={{ borderRadius: 2, marginLeft: 2 }}
              startIcon={<Add />}
            >
              Add Employee
            </Button>
          </Box>

          {view === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No employee found.</TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow key={employee._id}>
                          <TableCell>{employee.EMPID}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.phone}</TableCell>
                          <TableCell>{employee.address}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(employee._id)} sx={{ color: 'primary.main' }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteEmployee(employee)} sx={{ color: 'error.main' }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            renderStatsView()
          )}
        </>
      )}
    </Box>
  );
}

export default EmployeeDetails;
