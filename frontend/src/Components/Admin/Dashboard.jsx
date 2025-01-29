import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faUsers, faBoxOpen, faTruck, faShoppingCart, faComments, faRing } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../Images/s2.jpg'; // Adjust the path to your local image



export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jewelleryCount: 0,
      gemCount: 0,
      employeeCount: 0,
      inventoryCount: 0, // Initialize inventory count to 0
      supplierCount: 0, // Fake data for suppliers
      orderCount: 0, // Fake data for orders
      feedbackCount: 0, // Fake data for feedback
      userCount: 0, // User count state
    };
  }

  componentDidMount() {
    this.fetchJewelleryCount(); // Fetch the real jewellery count
    this.fetchGemCount(); // Fetch the real gem count
    this.fetchUserCount(); // Fetch the real user count
    this.fetchEmployeeCount(); // Fetch the real employee count
    this.fetchInventoryCount(); // Fetch the real inventory count
    this.fetchSupplierCount(); // Fetch the fake supplier count
    this.fetchOrderCount(); // Fetch the fake order count
    this.fetchFeedbackCount(); // Fetch the fake feedback count

    // Simulate real-time updates (example, every 10 seconds)
    this.interval = setInterval(() => {
      this.simulateRealTimeUpdates();
      this.fetchGemCount(); // Refresh gem count
      this.fetchUserCount(); // Refresh user count
      this.fetchEmployeeCount(); // Refresh employee count
      this.fetchInventoryCount(); // Refresh inventory count
      this.fetchSupplierCount(); // Refresh supplier count
      this.fetchOrderCount(); // Refresh order count
      this.fetchFeedbackCount(); // Refresh feedback count
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clear interval on component unmount
  }

  // Fetch the jewellery count from the server
  fetchJewelleryCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/jewellery');
      this.setState({ jewelleryCount: response.data.length });
    } catch (error) {
      console.error("Error fetching jewellery count:", error);
    }
  };

  // Fetch the gem count from the server
  fetchGemCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/api/gems'); // Ensure this points to your gems endpoint
      this.setState({ gemCount: response.data.length });
    } catch (error) {
      console.error("Error fetching gem count:", error);
    }
  };

  // Fetch the user count from the server
  fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/users'); // Ensure this points to your users endpoint
      this.setState({ userCount: response.data.length });
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  // Fetch the employee count from the server
  fetchEmployeeCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/employees'); // Ensure this points to your employees endpoint
      this.setState({ employeeCount: response.data.length }); // Set the employee count based on the retrieved data
    } catch (error) {
      console.error("Error fetching employee count:", error);
    }
  };

  // Fetch the inventory count from the server
  fetchInventoryCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/inventory'); // Ensure this points to your inventory endpoint
      this.setState({ inventoryCount: response.data.length }); // Set the inventory count based on the retrieved data
    } catch (error) {
      console.error("Error fetching inventory count:", error);
    }
  };
  fetchSupplierCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/api/suppliers'); // Ensure this points to your suppliers endpoint
      this.setState({ supplierCount: response.data.length }); // Set the supplier count based on the retrieved data
    } catch (error) {
      console.error("Error fetching supplier count:", error);
    }
  };
  fetchOrderCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/orders'); // Ensure this points to your orders endpoint
      this.setState({ orderCount: response.data.length }); // Set the order count based on the retrieved data
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  };
  fetchFeedbackCount = async () => {
    try {
      const response = await axios.get('http://localhost:4001/feedback'); // Ensure this points to your feedbacks endpoint
      this.setState({ feedbackCount: response.data.length }); // Set the feedback count based on the retrieved data
    } catch (error) {
      console.error("Error fetching feedback count:", error);
    }
  };

  // Simulate real-time updates for other counts (fake example)
  simulateRealTimeUpdates = () => {
    this.setState((prevState) => ({
      supplierCount: prevState.supplierCount + Math.floor(Math.random() * 1),
      orderCount: prevState.orderCount + Math.floor(Math.random() * 4),
      feedbackCount: prevState.feedbackCount + Math.floor(Math.random() * 1),
    }));
  };

  render() {
    const {
      jewelleryCount,
      gemCount,
      employeeCount,
      inventoryCount,
      supplierCount,
      orderCount,
      feedbackCount,
      userCount,
    } = this.state;

    return (
      <Box 
        sx={{
          padding: 4,
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#333', textShadow: '1px 1px 3px rgba(255, 255, 255, 0.7)' }}>Admin Dashboard</Typography>
        <Grid container spacing={3}>
       {/* User Count */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(187, 222, 251, 0.5)', // Transparent blue background
      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)', // Softer blue shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for the background
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faUsers} size="3x" color="#1976d2" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#0d47a1', // Darker blue for contrast
          letterSpacing: '0.05em',
        }}
      >
        Users
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {userCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#0d47a1',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of users
      </Typography>
    </CardContent>
  </Card>
</Grid>



        {/* Jewellery Items */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(249, 194, 255, 0.5)', // Transparent purple-pink background
      boxShadow: '0 8px 20px rgba(106, 27, 154, 0.5)', // Softer shadow with purple tone
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faRing} size="3x" color="#6a1b9a" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#4a148c', // Darker purple for contrast
          letterSpacing: '0.05em',
        }}
      >
        Jewellery Items
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#6a1b9a',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {jewelleryCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#4a148c',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of jewellery items
      </Typography>
    </CardContent>
  </Card>
</Grid>



        {/* Gems */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(187, 222, 251, 0.55)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)', // Softer shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faGem} size="3x" color="#1976d2" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#0d47a1', // Slightly darker blue for contrast
          letterSpacing: '0.05em',
        }}
      >
        Gems
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {gemCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#0d47a1',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of gems
      </Typography>
    </CardContent>
  </Card>
</Grid>


        {/* Employees */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(224, 247, 250, 0.5)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(56, 142, 60, 0.5)', // Softer shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faUsers} size="3x" color="#388e3c" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#004d40', // Slightly darker green for contrast
          letterSpacing: '0.05em',
        }}
      >
        Employees
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#388e3c',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {employeeCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#004d40',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of employees
      </Typography>
    </CardContent>
  </Card>
</Grid>


      {/* Inventory Items */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(255, 245, 229, 0.5)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(255, 152, 0, 0.5)', // Softer orange shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faBoxOpen} size="3x" color="#ff9800" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#e65100', // Darker orange for contrast
          letterSpacing: '0.05em',
        }}
      >
        Inventory Items
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#ff9800',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {inventoryCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#e65100',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of inventory items
      </Typography>
    </CardContent>
  </Card>
</Grid>


         {/* Suppliers */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(255, 249, 196, 0.5)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(251, 192, 45, 0.5)', // Softer yellow shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faTruck} size="3x" color="#fbc02d" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#f57f17', // Darker yellow for contrast
          letterSpacing: '0.05em',
        }}
      >
        Suppliers
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#fbc02d',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {supplierCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#f57f17',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of suppliers
      </Typography>
    </CardContent>
  </Card>
</Grid>


{/* Orders */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(255, 224, 178, 0.5)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(230, 74, 25, 0.5)', // Softer orange shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faShoppingCart} size="3x" color="#e64a19" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#bf360c', // Darker orange for contrast
          letterSpacing: '0.05em',
        }}
      >
        Orders
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#e64a19',
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {orderCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#bf360c',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total number of orders
      </Typography>
    </CardContent>
  </Card>
</Grid>


{/* Feedbacks */}
<Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{
      backgroundColor: 'rgba(237, 231, 246, 0.5)', // Transparent gradient-like background
      boxShadow: '0 8px 20px rgba(106, 27, 154, 0.5)', // Softer purple shadow
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out', // Hover effect
      backdropFilter: 'blur(10px)', // Blur effect for transparency
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faComments} size="3x" color="#6a1b9a" />
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
          color: '#6a1b9a', // Dark purple for title
          letterSpacing: '0.05em',
        }}
      >
        Feedbacks
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: '#4a148c', // Darker purple for number
          fontSize: '3rem',
          marginTop: '0.5rem',
        }}
      >
        {feedbackCount}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#6a1b9a',
          fontStyle: 'italic',
          marginTop: '0.5rem',
        }}
      >
        Total feedbacks received
      </Typography>
    </CardContent>
  </Card>
</Grid>

        </Grid>
      </Box>
    );
  }
}
