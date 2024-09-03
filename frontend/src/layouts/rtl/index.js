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

function ProductTable() {
  const [productRows, setProductRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getProducts');
        const data = response.data;

        const formattedRows = data.map((product) => ({
          productName: product.NAMA_PRODUK, // Ensure this matches your data structure
          category: product.NAMA_KATEGORI, // Ensure this matches your data structure
          unit: product.NAMA_SATUAN, // Ensure this matches your data structure
          stock: product.JUMLAH_STOK, // Ensure this matches your data structure
          price: product.HARGA_JUAL, // Ensure this matches your data structure
        }));

        setProductRows(formattedRows);
        setFilteredRows(formattedRows);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  // Filter rows based on search term
  useEffect(() => {
    const results = productRows.filter(row =>
      row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
  }, [searchTerm, productRows]);

  const columns = [
    { Header: "Product Name", accessor: "productName", width: "25%", align: "left" },
    { Header: "Category", accessor: "category", align: "left" },
    { Header: "Unit", accessor: "unit", align: "left" },
    { Header: "Stock", accessor: "stock", align: "center" },
    { Header: "Price", accessor: "price", align: "right" },
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
                  Products Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </MDBox>
              <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
                {/* Print Button */}
                <Button
                  variant="contained"
                  color="white"
                  onClick={handlePrint}
                >
                  Print
                </Button>
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

export default ProductTable;
