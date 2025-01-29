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
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  List,
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import { BarChartOutlined } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4001/bookings";

const fetchBookings = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [originalBookings, setOriginalBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [viewMode, setViewMode] = useState('bookings');

  const navigate = useNavigate();

  const loadBookings = async () => {
    try {
      const data = await fetchBookings();
      setBookings(data);
      setOriginalBookings(data);
      setNoResults(data.length === 0);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setBookings(originalBookings);
    } else {
      const filteredBookings = originalBookings.filter(item =>
        Object.values(item).some(field =>
          field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setBookings(filteredBookings);
      setNoResults(filteredBookings.length === 0);
    }
  }, [searchQuery, originalBookings]);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-booking/${id}`);
  };

  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        loadBookings();
        alert("Booking deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting booking:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    if (bookings.length === 0) {
      alert("No bookings available for download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("SKY LIGHT CINEMA", 10, 10);
    doc.setFontSize(12);
    doc.text("Booking Details Report", 10, 20);

    doc.autoTable({
      head: [['Booking ID', 'Count', 'Movie Name', 'Show Time', 'Date', 'Seat Type']],
      body: bookings.map(item => [
        item.BookingId,
        item.count,
        item.movieId,
        item.showTimeId,
        new Date(item.date).toLocaleDateString(),
        item.seat,
      ]),
      startY: 30,
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

    doc.save('booking-details.pdf');
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const renderAnalysisView = () => {
    const totalBookings = bookings.length;

    // Calculate the most booked movie
    const popularMovie = bookings
      .map(item => item.movieId)
      .reduce((acc, movie) => ({ ...acc, [movie]: (acc[movie] || 0) + 1 }), {});
    const mostBookedMovie = Object.keys(popularMovie).reduce((a, b) => (popularMovie[a] > popularMovie[b] ? a : b), '');

    // Calculate the most popular show time
    const popularShowTime = bookings
      .map(item => item.showTimeId)
      .reduce((acc, showTime) => ({ ...acc, [showTime]: (acc[showTime] || 0) + 1 }), {});
    const mostPopularShowTime = Object.keys(popularShowTime).reduce((a, b) => (popularShowTime[a] > popularShowTime[b] ? a : b), '');

    // Count bookings by date
    const bookingByDate = bookings
      .map(item => new Date(item.date).toLocaleDateString())
      .reduce((acc, date) => ({ ...acc, [date]: (acc[date] || 0) + 1 }), {});

    // Count bookings by seat type
    const seatTypeDistribution = bookings
      .map(item => item.seat)
      .reduce((acc, seat) => ({ ...acc, [seat]: (acc[seat] || 0) + 1 }), {});

    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">Detailed Analysis</Typography>
        <Typography variant="body1">Total Bookings: {totalBookings}</Typography>
        <Typography variant="body1">Most Booked Movie: {mostBookedMovie}</Typography>
        <Typography variant="body1">Most Popular Show Time: {mostPopularShowTime}</Typography>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Booking Trends by Date</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Bookings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(bookingByDate).map(([date, count]) => (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Seat Type Distribution</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seat Type</TableCell>
                  <TableCell>Total Bookings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(seatTypeDistribution).map(([seat, count]) => (
                  <TableRow key={seat}>
                    <TableCell>{seat}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="View Mode"
          sx={{ marginBottom: 2 }}
        >
          <ToggleButton value="bookings" aria-label="Booking List">
            <List /> Bookings
          </ToggleButton>
          <ToggleButton value="analysis" aria-label="Analysis">
            <BarChartOutlined /> Analysis
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'bookings' ? (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexShrink: 1, width: '200px', backgroundColor: 'white', borderRadius: 1 }}
            />
          </Box>

          <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Movie Name</TableCell>
                    <TableCell>Show Time</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Seat Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {noResults ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No booking found.</TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((item) => (
                      <TableRow key={item.BookingId}>
                        <TableCell>{item.BookingId}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>{item.movieId}</TableCell>
                        <TableCell>{item.showTimeId}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.seat}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(item._id)} sx={{ color: 'primary.main' }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => deleteBooking(item._id)} sx={{ color: 'error.main' }}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Button variant="contained" color="primary" onClick={handlePDF} sx={{ marginTop: 2 }}>
              <Print /> Download
            </Button>
          </Box>
        </Box>
      ) : (
        renderAnalysisView() // Render the analysis view here
      )}
    </Box>
  );
}

export default BookingDetails;
