import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddPayment from './AddPayment';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/payment";

const fetchPayments = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [view, setView] = useState('table'); // For toggling views (table or stats)
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments().then(data => {
      setPayments(data);
    }).catch(error => {
      console.error("Error fetching payments:", error);
    });
  }, []);

  // Debounce effect for live search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() === "") {
        fetchPayments()
          .then((data) => {
            setPayments(data);
            setNoResults(false);
          })
          .catch((error) => console.error("Error fetching payments:", error));
      } else {
        const filteredPayments = payments.filter(item =>
          Object.values(item).some(field =>
            field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setPayments(filteredPayments);
        setNoResults(filteredPayments.length === 0);
      }
    }, 300); // Debounce search for 300ms

    // Cleanup function
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-payment/${id}`);
  };

  const deletePayment = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        setPayments(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting payment:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set the title and subheading
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204); // Set title color
    doc.text('SKY LIGHT CINEMA', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Set subtitle color to black
    doc.text('Payment Details Report', pageWidth / 2, 30, { align: 'center' });

    // AutoTable to handle data
    doc.autoTable({
      startY: 40, // Adjust the start position for the table
      head: [['Payment ID', 'Amount', 'Method', 'Status', 'Transaction Date']],
      body: payments.map(item => [
        item.PID,
        `LKR ${item.amount.toFixed(2)}`, // Format amount as LKR
        item.method,
        item.status,
        new Date(item.transactionDate).toLocaleDateString(),
      ]),
      margin: { top: 10 },
      headStyles: {
        fillColor: [0, 102, 204], // Header background color
        textColor: [255, 255, 255], // Header text color
        fontStyle: 'bold', // Bold header text
      },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        cellPadding: 5, // Increase padding for readability
        tableWidth: 'auto', // Adjust table width to content
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Set specific widths to columns
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
        4: { cellWidth: 30 },
      },
      didDrawPage: function (data) {
        // Footer
        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Footer text color
        doc.text(`Report generated on: ${date}`, 10, pageHeight - 10); // Left-aligned footer
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 10); // Right-aligned footer
      }
    });

    doc.save('payment-details.pdf');
  };

  const handleAddPayment = () => {
    setShowAddPaymentForm(true);
  };

  const handleBack = () => {
    setShowAddPaymentForm(false);
  };

  const handleEmpPay = () => {
    navigate('/admindashboard/EmpPay');
  };

  // Calculate statistics
  const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const avgPayment = (totalPayments / payments.length) || 0;
  const methodDistribution = payments.reduce((acc, curr) => {
    acc[curr.method] = (acc[curr.method] || 0) + 1;
    return acc;
  }, {});

  // Render the statistics view
  const renderStatsView = () => (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>Total Payments: {payments.length}</Typography>
      <Typography variant="h6" gutterBottom>Total Amount: LKR {totalPayments.toFixed(2)}</Typography>
      <br />
      <Typography variant="h6" gutterBottom>Payment Methods Distribution:</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(methodDistribution).map((method) => (
              <TableRow key={method}>
                <TableCell>{method}</TableCell>
                <TableCell>{methodDistribution[method]}</TableCell>
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
      {showAddPaymentForm ? (
        <Box>
          <AddPayment onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexShrink: 1,
                width: '200px',
                backgroundColor: 'white',
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
            <Button variant="contained" color="secondary" onClick={handleEmpPay} sx={{ marginLeft: 2 }}>
              Employee Payments
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
            <Button variant="contained" color="secondary" onClick={handleAddPayment} sx={{ borderRadius: 2 }} startIcon={<Add />}>
              Add Payment
            </Button>
          </Box>

          {view === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Transaction Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No results found</TableCell>
                      </TableRow>
                    ) : (
                      payments.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.PID}</TableCell>
                          <TableCell>LKR {item.amount.toFixed(2)}</TableCell>
                          <TableCell>{item.method}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>{new Date(item.transactionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => handleEdit(item._id)} 
                              sx={{ color: 'blue' }} // Change the color for edit action
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              onClick={() => deletePayment(item._id)} 
                              sx={{ color: 'red' }} // Change the color for delete action
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handlePDF} 
                sx={{ marginTop: 2 }} 
                startIcon={<Print />}
              >
                Download
              </Button>
            </Box>
          ) : renderStatsView()}
        </>
      )}
    </Box>
  );
}

export default PaymentDetails;
