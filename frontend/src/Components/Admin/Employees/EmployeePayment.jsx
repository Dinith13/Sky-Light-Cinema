import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
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

function EmployeePayment() {
  const [employees, setEmployees] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]); // Store the original employee list
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees().then(data => {
      setEmployees(data);
      setOriginalEmployees(data); // Store the original employee list
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setEmployees(originalEmployees); // Reset to original employees if search is empty
      setNoResults(false);
      return;
    }

    const filteredEmployees = originalEmployees.filter(employee =>
      Object.values(employee).some(field =>
        field && field.toString().toLowerCase().includes(query)
      )
    );

    setEmployees(filteredEmployees);
    setNoResults(filteredEmployees.length === 0);
  };

  const handleAddEmployee = () => {
    setShowAddEmployeeForm(true);
  };

  const handleBack = () => {
    setShowAddEmployeeForm(false);
  };

  const handleAddSalary = (id) => {
    navigate(`/admindashboard/add-salary/${id}`); // Redirect to Add Salary page
  };

  const handleSummaryReport = () => {
    navigate('/admindashboard/summary-report'); // Navigate to the Summary Report page
  };

  return (
    <Box>
      {showAddEmployeeForm ? (
        <Box>
          <AddEmployee onBack={handleBack} />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '1600px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center', marginTop: 4 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch} // Call handleSearch on input change
              sx={{
                flexShrink: 1,
                width: '300px',
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
          </Box>

          <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {noResults ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No employee found.</TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>{employee.EMPID}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>LKR {employee.salary}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="info"
                            onClick={() => handleAddSalary(employee._id)}
                            sx={{ marginLeft: 1 }}
                          >
                            Add Salary
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSummaryReport}>
              Summary Report
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default EmployeePayment;
