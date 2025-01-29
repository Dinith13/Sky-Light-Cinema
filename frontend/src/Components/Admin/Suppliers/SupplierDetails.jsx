/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton } from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddSupplier from './AddSupplier';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/suppliers";

const fetchSuppliers = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const abbreviateId = (id) => {
  return id.length > 8 ? `${id.substring(0, 8)}...` : id;
};

function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers().then(data => {
      setSuppliers(data);
    }).catch(error => {
      console.error("Error fetching suppliers:", error);
    });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-supplier/${id}`);
  };

  const deleteSupplier = async (id) => {
    try {
      console.log(`Attempting to delete supplier with ID: ${id}`);
      const response = await axios.delete(`${URL}/${id}`);
      
      console.log('Delete response:', response);
      
      if (response.status === 200) {
        console.log(`Successfully deleted supplier with ID: ${id}`);
        setSuppliers(prev => {
          const updatedList = prev.filter(item => item._id !== id);
          console.log('Updated supplier list:', updatedList);
          return updatedList;
        });
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("Supplier Details Report", 10, 10);

    doc.autoTable({
      head: [['ID', 'Order ID', 'Type', 'Quantity', 'Inventory ID', 'Jewellery ID', 'Supplier ID', 'Status', 'Date', 'Description']],
      body: suppliers.map(item => [
        abbreviateId(item._id),
        abbreviateId(item.SupOrderID),
        item.type,
        item.quantity,
        abbreviateId(item.InvID),
        abbreviateId(item.JID),
        abbreviateId(item.SupID),
        item.status,
        new Date(item.date).toLocaleDateString(),
        item.description || 'No Description'
      ]),
      startY: 20,
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

    doc.save('supplier-details.pdf');
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchSuppliers().then(data => {
        setSuppliers(data);
        setNoResults(false);
      }).catch(error => {
        console.error("Error fetching suppliers:", error);
      });
      return;
    }

    const filteredSuppliers = suppliers.filter(item =>
      Object.values(item).some(field =>
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setSuppliers(filteredSuppliers);
    setNoResults(filteredSuppliers.length === 0);
  };

  const handleAddSupplier = () => {
    setShowAddSupplierForm(true);
  };

  const handleBack = () => {
    setShowAddSupplierForm(false);
  };

  return (
    <Box>
      {showAddSupplierForm ? (
        <Box>
          <AddSupplier onBack={handleBack} />
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ borderRadius: 2 }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddSupplier}
              sx={{ borderRadius: 2, marginLeft: 'auto' }}
              startIcon={<Add />}
            >
              Add Supplier
            </Button>
          </Box>

          <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    
                    <TableCell>Order ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Inventory ID</TableCell>
                    <TableCell>Jewellery ID</TableCell>
                    <TableCell>Supplier ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {noResults ? (
                    <TableRow>
                      <TableCell colSpan={11} align="center">No supplier orders found.</TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((item) => (
                      <TableRow key={item._id}>
                       
                        <TableCell>{abbreviateId(item.SupOrderID)}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{abbreviateId(item.InvID)}</TableCell>
                        <TableCell>{abbreviateId(item.JID)}</TableCell>
                        <TableCell>{abbreviateId(item.SupID)}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.description || 'No Description'}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(item._id)} sx={{ color: 'primary.main' }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => deleteSupplier(item._id)} sx={{ color: 'error.main' }}>
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
              sx={{ marginTop: 2, borderRadius: 2 }}
            >
              <Print /> Download
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SupplierDetails;
