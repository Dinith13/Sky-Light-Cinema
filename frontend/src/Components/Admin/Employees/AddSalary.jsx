import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AddSalary = () => {
  const { id } = useParams(); // This is the MongoDB ID
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  const [basicSalary, setBasicSalary] = useState('');
  const [otRate, setOtRate] = useState('');
  const [otHours, setOtHours] = useState('');
  const [leaveDays, setLeaveDays] = useState(localStorage.getItem('leaveDays') || ''); // Load from local storage
  const [dailyRate, setDailyRate] = useState(localStorage.getItem('dailyRate') || ''); // Load from local storage
  const [totalSalary, setTotalSalary] = useState('');

  const etfRate = 3; // ETF rate (3%)
  const epfCompanyRate = 12; // EPF rate from company (12%)
  const epfEmployeeRate = 8; // EPF rate from employee (8%)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/employees/${id}`);
        setEmployee(response.data);
        setBasicSalary(response.data.salary);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleCalculateSalary = () => {
    const ot = otRate * otHours;
    const leaveDeduction = leaveDays * dailyRate;

    // Calculate total salary based on the new formula
    const calculatedSalary = parseFloat(basicSalary) 
      + ot 
      - leaveDeduction 
      - (basicSalary * (epfEmployeeRate / 100)); // Deduction based on EPF rate from employee

    setTotalSalary(calculatedSalary);
  };

  const handleAddSalary = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        salary: totalSalary,
      };
      await axios.put(`http://localhost:4001/employees/${id}`, updatedEmployee);
      navigate('/admindashboard/EmpPay');
      
      // Clear local storage after saving
      localStorage.removeItem('leaveDays');
      localStorage.removeItem('dailyRate');
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  // Store leave days and daily rate in local storage
  const handleLeaveDaysChange = (e) => {
    const value = e.target.value;
    setLeaveDays(value);
    localStorage.setItem('leaveDays', value);
  };

  const handleDailyRateChange = (e) => {
    const value = e.target.value;
    setDailyRate(value);
    localStorage.setItem('dailyRate', value);
  };

  const handleDownloadPaySlip = () => {
    const ot = otRate * otHours; // Overtime calculation
    const leaveDeduction = leaveDays * dailyRate; // Leave deduction calculation
    const grossSalary = parseFloat(basicSalary) + ot; // Gross salary calculation
    const epfDeduction = basicSalary * (epfEmployeeRate / 100); // EPF deduction calculation
    const totalDeductions = epfDeduction + leaveDeduction; // Total deductions calculation
    const netSalary = grossSalary - totalDeductions; // Net salary calculation

    const epfAmount = parseFloat(basicSalary) * (epfCompanyRate / 100); // EPF calculation
    const etfAmount = parseFloat(basicSalary) * (etfRate / 100); // ETF calculation

    const doc = new jsPDF();

    // Company name and description (centered)
    doc.setFontSize(16);
    const companyName = "SKY LIGHT CINEMA";
    const companyDescription = "                            Thank you for your service";
    const pageWidth = doc.internal.pageSize.getWidth();
    const nameWidth = doc.getStringUnitWidth(companyName) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const descriptionWidth = doc.getStringUnitWidth(companyDescription) * doc.internal.getFontSize() / doc.internal.scaleFactor;

    // Centering the company name
    doc.text(companyName, (pageWidth - nameWidth) / 2, 10);
    
    // Centering the description
    doc.setFontSize(12);
    doc.text(companyDescription, (pageWidth - descriptionWidth) / 2, 20);
    
    doc.setFontSize(14);
    doc.text(`Pay Slip for ${employee ? employee.name : 'Employee'}`, 10, 35);
    
    // Adding Employee ID
    if (employee) {
      doc.text(`Employee ID: ${employee.EMPID}`, 10, 45);
    }

    // Print current date
    const currentDate = new Date().toLocaleDateString(); // Format as 'MM/DD/YYYY'
    doc.text(`Date: ${currentDate}`, 10, 55); // Print the current date below the Employee ID

    // Earnings Section
    doc.autoTable({
        head: [['Earnings', 'Amount']],
        body: [
            ['Basic Salary', basicSalary],
            ['Overtime', ot],
            ['Gross Salary', grossSalary],
        ],
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 65,
        margin: { top: 20 },
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
        },
    });

    // Deductions Section
    doc.autoTable({
        head: [['Deductions', 'Amount']],
        body: [
            ['EPF Deduction', epfDeduction],
            ['Leave Deduction', leaveDeduction],
            ['Total Deductions', totalDeductions], // Total Deduction Row
        ],
        startY: doc.autoTable.previous.finalY + 10,
        margin: { top: 20 },
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
        },
    });

    // Net Salary Section
    doc.autoTable({
        head: [['Net Salary', 'Amount']],
        body: [
            ['Net Salary', netSalary],
        ],
        startY: doc.autoTable.previous.finalY + 10,
        margin: { top: 20 },
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
        },
    });

    // Additional EPF and ETF Rows
    doc.autoTable({
        head: [['Details', 'Amount']],
        body: [
            ['EPF (12%)', epfAmount],
            ['ETF (3%)', etfAmount],
        ],
        startY: doc.autoTable.previous.finalY + 10,
        margin: { top: 20 },
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
        },
    });

    doc.save(`payslip_${employee ? employee.EMPID : 'employee'}.pdf`);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Blurred Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('https://entrepreneurship.babson.edu/wp-content/uploads/2020/10/Movie-1200-630.jpg')`, // Background image
          backgroundSize: 'cover', // Cover the entire container
          backgroundPosition: 'center', // Center the background image
          filter: 'blur(4px)', // Apply blur effect
          zIndex: 0, // Place it behind the content
        }}
      />
      
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          padding: 3,
          margin: 'auto', // Center horizontally
          height: '87%', // Set the height of the box to full
          width: '90%', // Set the width of the box
          maxWidth: '600px', // Maximum width for smaller box
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly transparent white background
          borderRadius: 2, // Rounded corners
          boxShadow: 3, // Shadow for depth
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start', // Align items to start
        }}
      >
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', marginBottom: 2 }}>
          Salary Details
        </Typography>
        <TextField
          label="Basic Salary"
          type="number"
          value={basicSalary}
          onChange={(e) => setBasicSalary(e.target.value)}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />

        {/* EPF and ETF Details in separate rows without enclosing box */}
        <TextField
          label="EPF (12% from Employer)"
          type="text"
          value={(basicSalary * (epfCompanyRate / 100)).toFixed(2)}
          InputProps={{
            readOnly: true,
          }}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />
        <TextField
          label="EPF (8% from Employee)"
          type="text"
          value={(basicSalary * (epfEmployeeRate / 100)).toFixed(2)}
          InputProps={{
            readOnly: true,
          }}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />
        <TextField
          label="ETF (3%)"
          type="text"
          value={(basicSalary * (etfRate / 100)).toFixed(2)}
          InputProps={{
            readOnly: true,
          }}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />


        <TextField
          label="Overtime Rate"
          type="number"
          value={otRate}
          onChange={(e) => setOtRate(e.target.value)}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />
        <TextField
          label="Overtime Hours"
          type="number"
          value={otHours}
          onChange={(e) => setOtHours(e.target.value)}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />
        <TextField
          label="Leave Days"
          type="number"
          value={leaveDays}
          onChange={handleLeaveDaysChange}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        />
        <TextField
          label="Daily Rate"
          type="number"
          value={dailyRate}
          onChange={handleDailyRateChange}
          sx={{ marginBottom: 2, width: '100%' }} // Set width to 100%
        /><br></br>
        
        {/* Calculate Salary Button */}
        <Button
          variant="contained"
          onClick={handleCalculateSalary}
          sx={{ marginBottom: 2, alignSelf: 'flex-start', width: '43%'  }} // Align left to avoid centering
        >
          Calculate Salary
        </Button>
        
        <Typography variant="h6" color={'white'} sx={{ marginBottom: 2 }}>Total Salary: {totalSalary}</Typography>

        {/* Buttons in the same row with reduced spacing and increased width */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="contained"
            onClick={handleAddSalary}
            sx={{ marginTop: 2, marginRight: 1, width: '43%' }} // Increased width and reduced margin
          >
            Save Salary
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadPaySlip}
            sx={{ marginTop: 2, marginLeft: 1, width: '43%' }} // Increased width and reduced margin
          >
            Download Pay Slip
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddSalary;
