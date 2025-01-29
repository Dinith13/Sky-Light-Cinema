import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const AnalysisView = ({ inventory, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filteredInventory, setFilteredInventory] = useState(inventory);

  const cardStyles = { 
    backgroundColor: '#ffffff', 
    borderRadius: '12px', 
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
    padding: '16px'
  };

  // Function to process inventory data
  const processInventoryData = () => {
    const typeCounts = {};
    const typeCosts = {};
    let totalCost = 0;

    filteredInventory.forEach(item => {
      // Count items by type
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;

      // Calculate total cost and total items per type
      totalCost += item.Cost;
      typeCosts[item.type] = (typeCosts[item.type] || { total: 0, count: 0 });
      typeCosts[item.type].total += item.Cost;
      typeCosts[item.type].count += 1;
    });

    // Convert type counts to arrays for display
    const typeData = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      averageCost: (typeCosts[type].total / typeCosts[type].count).toFixed(2),
    }));

    // Find most expensive items
    const mostExpensiveItems = [...filteredInventory].sort((a, b) => b.Cost - a.Cost).slice(0, 5);

    return { typeData, totalCost, mostExpensiveItems };
  };

  const { typeData, totalCost, mostExpensiveItems } = useMemo(() => processInventoryData(), [filteredInventory]);

  // Bar chart data
  const barData = typeData.map(({ type, averageCost }) => ({
    name: type,
    averageCost: parseFloat(averageCost),
  }));

  // Function to handle search
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.ItemName.toLowerCase().includes(value.toLowerCase())));
    }
  };

  // Function to filter inventory
  const handleFilterChange = (event) => {
    const { value } = event.target;
    setSelectedType(value);

    if (value === 'All') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.type === value));
    }
  };

  // Function to export to Excel
  const exportToExcel = () => {
    const fileName = 'Inventory_Report.xlsx';

    // Prepare summary statistics
    const summaryStats = [
      { Metric: 'Total Items', Value: inventory.length },
      { Metric: 'Total Cost', Value: `LKR ${totalCost.toFixed(2)}` },
      { Metric: 'Min Cost', Value: `LKR ${Math.min(...inventory.map(item => item.Cost)).toFixed(2)}` },
      { Metric: 'Max Cost', Value: `LKR ${Math.max(...inventory.map(item => item.Cost)).toFixed(2)}` },
    ];

    // Prepare type data for Excel
    const typeDataForExcel = typeData.map(({ type, count, averageCost }) => ({
      Type: type,
      Count: count,
      AverageCost: `LKR ${averageCost}`,
    }));

    // Prepare most expensive items for Excel
    const expensiveItemsForExcel = mostExpensiveItems.map(item => ({
      ItemName: item.ItemName,
      Cost: `LKR ${item.Cost.toFixed(2)}`,
      Type: item.type,
      MaintenanceID: item.MaintananceID,
      DateOfPurchase: item.purchaseDate,
      Quantity: item.quantity,
    }));

    // Combine all data into one sheet
    const dataForExport = [
      { Title: 'Summary Statistics' },
      ...summaryStats,
      { Title: ' ' }, // Add empty row
      { Title: 'Average Cost of Item Types' },
      ...typeDataForExcel,
      { Title: ' ' }, // Add empty row
      { Title: 'Most Expensive Items' },
      ...expensiveItemsForExcel,
    ];

    // Convert to sheet
    const ws = XLSX.utils.json_to_sheet(dataForExport, { header: ['Title', 'Metric', 'Value', 'Type', 'Count', 'AverageCost', 'ItemName', 'Cost', 'MaintenanceID', 'DateOfPurchase', 'Quantity'] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Inventory Analysis
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3, gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />

        <FormControl variant="outlined" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            onChange={handleFilterChange}
            label="Type"
          >
            <MenuItem value="All">All</MenuItem>
            {Array.from(new Set(inventory.map(item => item.type))).map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          onClick={exportToExcel} 
          sx={{ backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Export to Excel
        </Button>
      </Box>

      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold', 
          color: '#d32f2f', 
          fontSize: '1.5rem', 
          backgroundColor: '#ffebee', 
          padding: '0.5rem', 
          borderRadius: '4px' 
        }}
      >
        Total Inventory Cost: LKR {totalCost.toFixed(2)}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
        Summary Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" color="#1976d2">Total Items</Typography>
              <Typography variant="body1">{inventory.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" color="#1976d2">Min Cost</Typography>
              <Typography variant="body1">LKR {Math.min(...inventory.map(item => item.Cost)).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" color="#1976d2">Max Cost</Typography>
              <Typography variant="body1">LKR {Math.max(...inventory.map(item => item.Cost)).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
        Average Cost of Item Types
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageCost" fill="#64b5f6" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
        Most Expensive Items
      </Typography>
      <Grid container spacing={2}>
        {mostExpensiveItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.InvID}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" color="#d32f2f">{item.ItemName}</Typography>
                <Typography variant="body1">Cost: LKR {item.Cost.toFixed(2)}</Typography>
                <Typography variant="body2">Type: {item.type}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button 
        variant="outlined" 
        onClick={onBack} 
        sx={{ mt: 4, color: '#1976d2', borderColor: '#1976d2', '&:hover': { backgroundColor: '#e3f2fd' } }}
      >
        Back
      </Button>
    </Box>
  );
};

export default AnalysisView;
