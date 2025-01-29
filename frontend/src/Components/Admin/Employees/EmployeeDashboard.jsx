import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Import the images
import employeeImage from '../../images/employee.png';
import employeeImage1 from '../../images/employee1.png';

// Higher-order component to inject navigation prop
function withNavigation(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class EmployeeDashboard extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  handleViewEmployeeDetails = () => {
    // Navigate to the correct route: /admindashboard/employee-details
    this.props.navigate('/admindashboard/employee-details');
  };

  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
         
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ marginBottom: '2px' }}>Employee Dashboard</h1> {/* Reduced margin further */}

        {/* Flexbox container to align images side by side without space */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            marginTop: '0px', // No margin above images
          }}
        >
          {/* First image on the left */}
          <img
            src={employeeImage}
            alt="Employee 1"
            style={{ width: '50%', height: 'auto', marginRight: '-5px' }}
          />

          {/* Second image on the right */}
          <img
            src={employeeImage1}
            alt="Employee 2"
            style={{ width: '50%', height: 'auto', marginLeft: '-5px' }}
          />
        </div>

        {/* Button placed higher from the bottom center */}
        <div style={{ marginBottom: '140px' }}>
          <button
            style={{
              padding: '12px 22px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '17px',
            }}
            onClick={this.handleViewEmployeeDetails}
          >
            View Employee Details
          </button>
        </div>
      </div>
    );
  }
}

// Use the withNavigation HOC to pass the navigation prop
export default withNavigation(EmployeeDashboard);
