/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from 'axios'; // Import axios
import TextField from '@mui/material/TextField'; // Import TextField for search bar
import Button from '@mui/material/Button'; // Import Button for print functionality

function Tables() {
  const [userRows, setUserRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/getUsers');
        const data = response.data;

        const formattedRows = data.map((user) => ({
          author: user.NAMA_LENGKAP, // Ensure this is a string
          status: user.STATUS_AKTIF === "Aktif" ? "online" : "offline",
          employed: new Date(user.TANGGAL_PENDAFTARAN).toLocaleDateString(),
        }));

        setUserRows(formattedRows);
        setFilteredRows(formattedRows);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  // Filter rows based on search term
  useEffect(() => {
    const results = userRows.filter(row =>
      row.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
  }, [searchTerm, userRows]);

  const columns = [
    { Header: "User", accessor: "author", width: "45%", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Employed", accessor: "employed", align: "center" },
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = document.getElementById('printableTable').innerHTML;
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;} th {background-color: #f2f2f2;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {/* Container for Search Bar and Print Button */}
                <div className="search-and-print-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, marginRight: '1rem' }} // Adjust margin for spacing
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    style={{ color: 'white' }} // Set text color to white
                  >
                    Print
                  </Button>
                </div>
              </MDBox>
              <MDBox pt={3} id="printableTable">
                <DataTable
                  table={{ columns, rows: filteredRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
