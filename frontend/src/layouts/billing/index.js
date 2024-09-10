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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions"); // Adjust the endpoint as necessary
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

    // Validasi
    if (!transactionData.productName || !transactionData.quantity || !transactionData.price) {
      setWarning("Please fill in all required fields.");
      return;
    }

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

      setWarning(""); // Clear warning message

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

  const handleSelectProduct = (product) => {
    setTransactionData({
      ...transactionData,
      productName: product.NAMA_PRODUK,
      price: product.HARGA_JUAL,
    });
    setSelectedProduct(product);
    handleCloseProductDialog(); // Close the dialog
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    const subtotal = quantity * transactionData.price;
    setTransactionData({
      ...transactionData,
      quantity: quantity,
      subtotal: subtotal.toFixed(2),
    });
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
                {warning && <Alert severity="warning">{warning}</Alert>}
                <form
                  onSubmit={handleAddToCart}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleOpenProductDialog}
                      style={{ color: "white" }}
                    >
                      Select Product
                    </Button>
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
                  </div>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={transactionData.quantity}
                    onChange={handleQuantityChange}
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
                    columns: columns,
                    rows: cart,
                  }}
                  canSearch
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddTransaction}
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
            label="Search"
            variant="outlined"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            fullWidth
            margin="dense"
          />
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {filteredProducts.map((product) => (
              <div
                key={product.ID_PRODUK}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div>
                    <strong>{product.NAMA_PRODUK}</strong>
                  </div>
                  <div>Harga: Rp. {product.HARGA_JUAL}</div>
                  <div>Stok: {product.JUMLAH_STOK}</div>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSelectProduct(product)}
                  style={{ color: "white" }}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
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
