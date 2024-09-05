import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [transactionData, setTransactionData] = useState({
    productName: "",
    quantity: "",
    price: "",
    paymentMethod: "",
    subtotal: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/transactions"); // Adjust the endpoint as necessary
        setColumns([
          { Header: "Transaction ID", accessor: "transactionId" },
          { Header: "Product Name", accessor: "productName" },
          { Header: "Quantity", accessor: "quantity" },
          { Header: "Price", accessor: "price" },
          { Header: "Subtotal", accessor: "subtotal" },
          { Header: "Payment Method", accessor: "paymentMethod" },
        ]);
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/payment/paymentMethods");
        setPaymentMethods(
          response.data.map((method) => ({
            id: method.ID_METODE_PEMBAYARAN,
            name: method.METODE_PEMBAYARAN,
            description: method.DESKRIPSI,
          }))
        );
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/getProducts"); // Adjust the endpoint as necessary
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
    fetchPaymentMethods();
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.NAMA_PRODUK.toLowerCase().includes(productSearchTerm.toLowerCase())
      )
    );
  }, [productSearchTerm, products]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((cell) =>
      cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    try {
      const subtotal = transactionData.quantity * transactionData.price;
      setTransactionData({
        ...transactionData,
        subtotal: subtotal.toFixed(2),
      });

      setCart([...cart, transactionData]);

      setTransactionData({
        productName: "",
        quantity: "",
        price: "",
        paymentMethod: "",
        subtotal: "",
      });

      const response = await axios.get("/api/transactions"); // Update with correct endpoint
      setRows(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await axios.post("/api/transactions", cart); // Update with correct endpoint
      setCart([]);
    } catch (error) {
      console.error("Error adding transactions:", error);
    }
  };

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleSelectProduct = (row) => {
    const product = row.original; // Access the original data of the row
    setTransactionData({
      ...transactionData,
      productName: product.NAMA_PRODUK, // Update with the selected product's name
      price: product.HARGA_JUAL, // Update with the selected product's price
      quantity: product.JUMLAH_STOK, // Set default quantity or update as needed
    });
    handleCloseProductDialog(); // Close the dialog
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
                <form
                  onSubmit={handleAddToCart}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <TextField
                      label="Product Name"
                      variant="outlined"
                      value={transactionData.productName}
                      onChange={(e) =>
                        setTransactionData({ ...transactionData, productName: e.target.value })
                      }
                      style={{ width: "100%" }}
                      disabled
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpenProductDialog}
                      style={{ color: "white" }}
                    >
                      Select Product
                    </Button>
                  </div>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={transactionData.quantity}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, quantity: e.target.value })
                    }
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={transactionData.price}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, price: e.target.value })
                    }
                    disabled
                  />
                  <TextField
                    label="Subtotal"
                    variant="outlined"
                    type="number"
                    value={transactionData.subtotal}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, subtotal: e.target.value })
                    }
                    disabled
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ color: "white" }}
                  >
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
                      { Header: "Product Name", accessor: "productName" },
                      { Header: "Quantity", accessor: "quantity" },
                      { Header: "Price", accessor: "price" },
                      { Header: "Subtotal", accessor: "subtotal" },
                    ],
                    rows: cart,
                  }}
                  canSearch
                  search={searchTerm}
                  onSearch={setSearchTerm}
                />
                <br />
                <FormControl variant="outlined" style={{ width: "100%", height: "50px" }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={transactionData.paymentMethod}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, paymentMethod: e.target.value })
                    }
                    label="Payment Method"
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method.id} value={method.id}>
                        {method.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <MDTypography variant="h6">Total:</MDTypography>
                  <MDTypography variant="h6" style={{ color: "grey" }}>
                    Rp.{" "}
                  </MDTypography>{" "}
                  {/* Disabled subtotal text */}
                </div>
                <Button
                  onClick={handleAddTransaction}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "1rem", color: "white" }}
                >
                  Add Transaction
                </Button>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle>Select Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Products"
            variant="outlined"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
          <DataTable
            table={{
              columns: [
                { Header: "Product Name", accessor: "NAMA_PRODUK" },
                { Header: "Price", accessor: "HARGA_JUAL" },
                { Header: "Stok", accessor: "JUMLAH_STOK" },
              ],
              rows: filteredProducts,
            }}
            onRowClick={handleSelectProduct}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
