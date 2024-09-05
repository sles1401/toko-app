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

function ProductTable() {
  const [productRows, setProductRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
            <Button variant="contained" color="secondary" style={{ color: "white" }}>
              Edit
            </Button>
          ), // Edit button
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

  const columns = [
    { Header: "Product Name", accessor: "productName", width: "20%", align: "left" },
    { Header: "Category", accessor: "category", width: "20%", align: "left" },
    { Header: "Unit", accessor: "unit", width: "15%", align: "left" },
    { Header: "Stock", accessor: "stock", width: "15%", align: "center" },
    { Header: "Price", accessor: "price", width: "15%", align: "right" },
    { Header: "Edit", accessor: "edit", width: "15%", align: "center" }, // Edit column
  ];

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
    </DashboardLayout>
  );
}

export default ProductTable;
