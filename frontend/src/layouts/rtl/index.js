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

function ProductTable() {
  const [productRows, setProductRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editData, setEditData] = useState({
    productName: "",
    category: "",
    unit: "",
    stock: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/getProducts");
        const data = response.data;

        const formattedRows = data.map((product) => ({
          productName: product.NAMA_PRODUK,
          category: product.NAMA_KATEGORI,
          unit: product.NAMA_SATUAN,
          stock: product.JUMLAH_STOK,
          price: product.HARGA_JUAL,
          edit: (
            <Button
              variant="contained"
              color="secondary"
              style={{ color: "white" }}
              onClick={() => handleEdit(product)}
            >
              Edit
            </Button>
          ),
        }));

        setProductRows(formattedRows);
        setFilteredRows(formattedRows);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = productRows.filter(
      (row) =>
        row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
  }, [searchTerm, productRows]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    const printContent = document.getElementById("printableTable").innerHTML;
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;} th {background-color: #f2f2f2;}</style>"
    );
    printWindow.document.write("</head><body >");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditData({
      productName: product.NAMA_PRODUK,
      category: product.NAMA_KATEGORI,
      unit: product.NAMA_SATUAN,
      stock: product.JUMLAH_STOK,
      price: product.HARGA_JUAL,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Save logic goes here (call API to update product details)
    setOpen(false);
  };

  const columns = [
    { Header: "Product Name", accessor: "productName", width: "20%", align: "left" },
    { Header: "Category", accessor: "category", width: "20%", align: "left" },
    { Header: "Unit", accessor: "unit", width: "15%", align: "left" },
    { Header: "Stock", accessor: "stock", width: "15%", align: "center" },
    { Header: "Price", accessor: "price", width: "15%", align: "right" },
    { Header: "Edit", accessor: "edit", width: "15%", align: "center" },
  ];

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
                <div
                  className="search-and-print-container"
                  style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                >
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, marginRight: "1rem" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    style={{ color: "white" }}
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

      {/* Popup Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            fullWidth
            value={editData.productName}
            onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Unit"
            fullWidth
            value={editData.unit}
            onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Stock"
            fullWidth
            value={editData.stock}
            onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            fullWidth
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ProductTable;
