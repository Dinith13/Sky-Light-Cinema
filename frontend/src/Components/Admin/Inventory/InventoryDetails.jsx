import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddInventory from './AddInventory';
import AnalysisView from './AnalysisView';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import * as XLSX from 'xlsx';

const URL = 'http://localhost:4001/inventory';

const fetchInventory = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

function InventoryDetails() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchInventory();
        setInventory(data);
        setNoResults(false);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (debouncedSearchQuery.trim() === '') {
        fetchInventory()
          .then((data) => {
            setInventory(data);
            setNoResults(false);
          })
          .catch((error) => {
            console.error('Error fetching inventory:', error);
          });
        return;
      }

      const filteredInventory = inventory.filter((item) =>
        Object.values(item).some((field) =>
          field?.toString().toLowerCase().startsWith(debouncedSearchQuery.toLowerCase())
        )
      );
      setInventory(filteredInventory);
      setNoResults(filteredInventory.length === 0);
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-inventory/${id}`);
  };

  const deleteInventory = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        setInventory((prev) => prev.filter((item) => item._id !== id));
        setSnackbarMessage('Item deleted successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Error deleting item.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting item:', error.message);
      setSnackbarMessage('Error deleting item.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => axios.delete(`${URL}/${id}`)));
      setInventory((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      setSelectedIds([]);
      setSnackbarMessage('Selected items deleted successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error deleting items.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Skylight Cinema', 10, 10);
    doc.setFontSize(14);
    doc.text('Maintenance Details Report', 10, 20);
    doc.autoTable({
      head: [['ID', 'Item Name', 'Type', 'Maintenance ID', 'Cost', 'Date', 'Note']],
      body: inventory.map((item) => [
        item.InvID,
        item.ItemName,
        item.type,
        item.MaintananceID,
        item.Cost,
        new Date(item.Date).toLocaleDateString(),
        item.Note || 'No Note',
      ]),
    });
    doc.save('Inventory_Report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inventory.map((item) => ({
        ID: item.InvID,
        'Item Name': item.ItemName,
        Type: item.type,
        'Maintenance ID': item.MaintananceID,
        Cost: item.Cost,
        Date: new Date(item.Date).toLocaleDateString(),
        Note: item.Note || 'No Note',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'Inventory_Report.xlsx');
  };

  return (
    <Box>
      <Button onClick={exportToExcel}>Export to Excel</Button>
      {/* Other components */}
    </Box>
  );
}

export default InventoryDetails;
