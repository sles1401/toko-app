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
import axios from 'axios'; // Import axios for data fetching
import TextField from '@mui/material/TextField'; // Import TextField for input fields
import Button from '@mui/material/Button'; // Import Button for form submission and print functionality
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material'; // Import additional components for dropdowns
import Dialog from '@mui/material/Dialog'; // Import Dialog for product selection
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [transactionData, setTransactionData] = useState({
    productName: '',
    quantity: '',
    price: '',
    paymentMethod: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/transactions'); // Adjust the API endpoint as needed
        setColumns(response.data.columns.map(col => ({ Header: col, accessor: col })));
        setRows(response.data.rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch payment methods
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/api/payment-methods'); // Adjust the API endpoint as needed
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    // Fetch product list
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // Adjust the API endpoint as needed
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
    fetchPaymentMethods();
    fetchProducts();
  }, []);

  // Filter rows based on search term
  const filteredRows = rows.filter(row =>
    row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle print functionality
  const handlePrint = () => {
    const printContent = document.getElementById('printableTable').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  // Handle form submission to add to cart
  const handleAddToCart = async (event) => {
    event.preventDefault();
    try {
      // Add transaction to cart
      setCart([...cart, transactionData]);

      // Optionally, clear form
      setTransactionData({
        productName: '',
        quantity: '',
        price: '',
        paymentMethod: ''
      });

      // Fetch updated data
      const response = await axios.get('/api/transactions');
      setRows(response.data.rows);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Handle transaction addition
  const handleAddTransaction = async () => {
    try {
      await axios.post('/api/transactions', cart); // Adjust the API endpoint as needed
      // Clear cart after adding transactions
      setCart([]);
    } catch (error) {
      console.error("Error adding transactions:", error);
    }
  };

  // Open product selection dialog
  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };

  // Close product selection dialog
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  // Handle product selection
  const handleSelectProduct = (product) => {
    setTransactionData({ ...transactionData, productName: product });
    handleCloseProductDialog();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
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
                  Transaction
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {/* Form for Adding Transactions */}
                <form onSubmit={handleAddToCart} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label="Product Name"
                      variant="outlined"
                      value={transactionData.productName}
                      onChange={(e) => setTransactionData({ ...transactionData, productName: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpenProductDialog}
                      style={{ marginLeft: '1rem' }}
                    >
                      Select Product
                    </Button>
                  </div>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={transactionData.quantity}
                    onChange={(e) => setTransactionData({ ...transactionData, quantity: e.target.value })}
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={transactionData.price}
                    onChange={(e) => setTransactionData({ ...transactionData, price: e.target.value })}
                    disabled
                  />
                  <TextField
                    label="Subtotal"
                    variant="outlined"
                    type="number"
                    value={transactionData.subtotal}
                    onChange={(e) => setTransactionData({ ...transactionData, subtotal: e.target.value })}
                    disabled
                  />
                  <FormControl variant="outlined">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={transactionData.paymentMethod}
                      onChange={(e) => setTransactionData({ ...transactionData, paymentMethod: e.target.value })}
                      label="Payment Method"
                    >
                      {paymentMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }}>
                    Add to Cart
                  </Button>
                </form>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Cart
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <DataTable
                  table={{
                    columns: [
                      { Header: 'Product Name', accessor: 'productName' },
                      { Header: 'Quantity', accessor: 'quantity' },
                      { Header: 'Price', accessor: 'price' }
                    ], rows: cart
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MDTypography variant="h6">Total:</MDTypography>
                  <MDTypography variant="h6" style={{ color: 'grey' }}>Rp. </MDTypography> {/* Disabled subtotal text */}
                </div>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddTransaction}
                  style={{ marginTop: '1rem', backgroundColor: '#4caf50', color: 'white', width: '100%' }} // Green background with white text and full width
                >
                  Add Transaction
                </Button>
                <MDBox mt={2} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ color: 'white' }} // White text for "Pay"
                  >
                    Pay
                  </Button>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Product Selection Dialog */}
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle>Select Product</DialogTitle>
        <DialogContent>
          <MDBox>
            {products.map((product) => (
              <MDTypography
                key={product}
                onClick={() => handleSelectProduct(product)}
                style={{ cursor: 'pointer', padding: '0.5rem 0' }}
              >
                {product}
              </MDTypography>
            ))}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
