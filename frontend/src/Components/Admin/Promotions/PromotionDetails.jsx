import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, Switch, FormControlLabel, Divider } from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddPromotion from './AddPromotion'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/promotions";

const fetchPromotions = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function PromotionDetails() {
  const [promotions, setPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddPromotionForm, setShowAddPromotionForm] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'analysis'
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromotions().then(data => {
      setPromotions(data);
    }).catch(error => {
      console.error("Error fetching promotions:", error);
    });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-promotion/${id}`);
  };

  const deletePromotion = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        setPromotions(prev => prev.filter(promotion => promotion._id !== id));
      }
    } catch (error) {
      console.error("Error deleting promotion:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("SKY LIGHT CINEMA - Promotion Details Report", 10, 10); // Updated title

    doc.autoTable({
      head: [['ID', 'Title', 'Description', 'Discount Percentage', 'Valid From', 'Valid To', 'Payment Methods']],
      body: promotions.map(promotion => [
        promotion.PROMOID,
        promotion.title,
        promotion.description,
        `${promotion.discountPercentage}%`,
        new Date(promotion.validFrom).toLocaleDateString(),
        new Date(promotion.validTo).toLocaleDateString(),
        promotion.paymentMethods ? promotion.paymentMethods.join(', ') : 'N/A'
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

    doc.save('promotion-details.pdf');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      fetchPromotions().then(data => {
        setPromotions(data);
        setNoResults(false);
      }).catch(error => {
        console.error("Error fetching promotions:", error);
      });
      return;
    }

    const filteredPromotions = promotions.filter(promotion =>
      Object.values(promotion).some(field =>
        field && field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setPromotions(filteredPromotions);
    setNoResults(filteredPromotions.length === 0);
  };

  const handleAddPromotion = () => {
    setShowAddPromotionForm(true);
  };

  const handleBack = () => {
    setShowAddPromotionForm(false);
  };

  const handleToggleView = () => {
    setViewMode(viewMode === 'table' ? 'analysis' : 'table');
  };

  const calculateAnalysisData = () => {
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter(promotion => new Date(promotion.validTo) >= new Date()).length;
    const averageDiscount = (promotions.reduce((sum, promo) => sum + promo.discountPercentage, 0) / totalPromotions).toFixed(2);

    return {
      totalPromotions,
      activePromotions,
      averageDiscount
    };
  };

  const { totalPromotions, activePromotions, averageDiscount } = calculateAnalysisData();

  return (
    <Box>
      {showAddPromotionForm ? (
        <Box>
          <AddPromotion onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch} // Call handleSearch directly on input change
              sx={{
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
            <FormControlLabel
              control={<Switch checked={viewMode === 'analysis'} onChange={handleToggleView} />}
              label={viewMode === 'analysis' ? "Switch to Table View" : "Switch to Analysis View"}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddPromotion}
              sx={{ borderRadius: 2 }}
              startIcon={<Add />}
            >
              Add Promotion
            </Button>
          </Box>

          {viewMode === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Discount Percentage</TableCell>
                      <TableCell>Valid From</TableCell>
                      <TableCell>Valid To</TableCell>
                      <TableCell>Payment Methods</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">No promotion found.</TableCell>
                      </TableRow>
                    ) : (
                      promotions.map((promotion) => (
                        <TableRow key={promotion._id}>
                          <TableCell>{promotion.PROMOID}</TableCell>
                          <TableCell>{promotion.title}</TableCell>
                          <TableCell>{promotion.description}</TableCell>
                          <TableCell>{promotion.discountPercentage}%</TableCell>
                          <TableCell>{new Date(promotion.validFrom).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(promotion.validTo).toLocaleDateString()}</TableCell>
                          <TableCell>{promotion.paymentMethods ? promotion.paymentMethods.join(', ') : 'N/A'}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(promotion._id)} sx={{ color: 'primary.main' }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deletePromotion(promotion._id)} sx={{ color: 'error.main' }}>
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
          ) : (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Promotion Analysis
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', backgroundColor: '#f9f9f9' }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Promotions</TableCell>
                      <TableCell>{totalPromotions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Active Promotions</TableCell>
                      <TableCell>{activePromotions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Average Discount</TableCell>
                      <TableCell>{averageDiscount}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default PromotionDetails;
