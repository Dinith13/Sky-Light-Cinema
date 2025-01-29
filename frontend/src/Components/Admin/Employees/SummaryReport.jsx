import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const URL = "http://localhost:4001/employees"; // Adjust the URL as necessary

const SummaryReport = () => {
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalEPF, setTotalEPF] = useState(0);
  const [totalETF, setTotalETF] = useState(0);
  const [netPayment, setNetPayment] = useState(0); // State for net payment

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(URL);
        const employees = response.data;

        // Calculate the total salary of all employees
        const total = employees.reduce((sum, employee) => sum + employee.salary, 0);
        setTotalSalary(total);

        // Calculate total EPF and ETF
        const epfTotal = employees.reduce((sum, employee) => sum + (employee.salary * 0.12), 0);
        const etfTotal = employees.reduce((sum, employee) => sum + (employee.salary * 0.03), 0);

        setTotalEPF(epfTotal);
        setTotalETF(etfTotal);

        // Calculate net payment
        const net = total + epfTotal + etfTotal;
        setNetPayment(net);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const downloadSummaryReport = () => {
    const doc = new jsPDF();
    
    // Get the PDF page width
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Add the title and details to the PDF, centering the first two lines
    doc.setFontSize(20);
    doc.text('SKY LIGHT CINEMA', pageWidth / 2, 20, { align: 'center' }); // Centered title
    doc.setFontSize(16);
    doc.text('', pageWidth / 2, 30, { align: 'center' }); // Centered subheading
  
    // Add remaining details (aligned to the left)
    doc.setFontSize(14);
    doc.text(`Total Salary of All Employees: Rs. ${totalSalary}`, 20, 50);
    doc.text(`Total EPF (12%): Rs. ${totalEPF.toFixed(2)}`, 20, 60);
    doc.text(`Total ETF (3%): Rs. ${totalETF.toFixed(2)}`, 20, 70);
  
    // Add some space before the net payment
    doc.setFontSize(16); // Increase font size for net payment
    doc.text(`Net Payment for All Employees: Rs. ${netPayment.toFixed(2)}`, 20, 90); // Adjusted Y-coordinate for spacing

    // Save the PDF
    doc.save('summary-report.pdf');
  };

  // Inline styles for the component
  const styles = {
    container: {
      position: 'relative', // Position for the pseudo-element
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center items horizontally
      justifyContent: 'flex-start', // Align items to the top
      height: '100vh', // Full viewport height
      overflow: 'hidden', // Hide overflow to keep the blur within bounds
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover', // Cover the entire container
      backgroundPosition: 'center', // Center the background image
      filter: 'blur(4px)', // Apply blur effect
      zIndex: 0, // Place it behind the content
    },
    content: {
      position: 'relative', // Positioning for content
      zIndex: 1, // Place content above the background
      color: 'black', // Set text color to black
      width: '100%', // Ensure content takes full width
      textAlign: 'center', // Center the text within the content
      marginTop: '20px', // Optional: Space from the top
    },
    heading: {
      fontSize: '36px', // Increase font size for the heading
      fontWeight: 'bold', // Make it bold
      marginBottom: '10px', // Add some space below
    },
    subheading: {
      fontSize: '24px', // Increased font size for the subheading
      marginBottom: '20px', // Add space below the subheading
    },
    reportBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white background
      borderRadius: '10px', // Rounded corners
      padding: '30px', // Increased padding inside the box
      margin: '20px auto', // Margin for spacing and auto for horizontal centering
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Slight shadow for depth
      width: '100%', // Full width
      maxWidth: '700px', // Increased maximum width for the box
      textAlign: 'center', // Center text inside the box
    },
    totalSalary: {
      fontSize: '24px', // Increase font size
      marginTop: '10px', // Add some space above
      textAlign: 'left', // Align text to the left
    },
    epf: {
      fontSize: '24px', // Increase font size
      marginTop: '10px', // Add some space above
      textAlign: 'left', // Align text to the left
    },
    etf: {
      fontSize: '24px', // Increase font size
      marginTop: '10px', // Add some space above
      textAlign: 'left', // Align text to the left
    },
    netPayment: {
      fontSize: '28px', // Increase font size for net payment
      marginTop: '10px', // Add some space above
      fontWeight: 'bold', // Make net payment bold
      textAlign: 'left', // Align text to the left
    },
    downloadButton: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '18px',
      color: '#fff',
      backgroundColor: '#007bff', // Button color
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.content}>
        {/* Title and Subheading at the Top */}
        <h1 style={styles.heading}>SKY LIGHT CINEMA</h1>
        
        {/* Transparent Box for the report details */}
        <div style={styles.reportBox}>
          <p style={styles.totalSalary}>
            Total Salary of All Employees: Rs. {totalSalary}
          </p>
          <p style={styles.epf}>
            Total EPF (12%): Rs. {totalEPF.toFixed(2)} {/* Show two decimal places */}
          </p>
          <p style={styles.etf}>
            Total ETF (3%): Rs. {totalETF.toFixed(2)} {/* Show two decimal places */}
          </p><br></br>
          <p style={styles.netPayment}>
            Net Payment for All Employees: Rs. {netPayment.toFixed(2)} {/* Show two decimal places */}
          </p><br></br>
          <button style={styles.downloadButton} onClick={downloadSummaryReport}>
            Download Summary Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;
