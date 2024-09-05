import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";
import axios from "axios";

function Report() {
  const [data, setData] = useState({
    revenue: "0",
    productPrice: "0",
  });

  const [employeeRevenue, setEmployeeRevenue] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard");
        const { PENDAPATAN, HARGA_PRODUK } = response.data;

        setData({
          revenue: formatCurrency(PENDAPATAN),
          productPrice: formatCurrency(HARGA_PRODUK),
        });

        const employeeRevenueResponse = await axios.get(
          "http://localhost:5000/api/employee-revenue"
        );
        setEmployeeRevenue(employeeRevenueResponse.data);

        const productsResponse = await axios.get("http://localhost:5000/api/products");
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function formatCurrency(value) {
    return `${Number(value).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`;
  }

  const handlePrint = (title, id) => {
    window.print();
    // You can add logic here to print based on `id` if needed.
    console.log(`Printing ${title} with ID: ${id}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Revenue Report */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="attach_money"
                title="Omset Penjualan"
                count={data.revenue}
                percentage={{ color: "success", amount: "", label: "Hari Ini" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Omset Penjualan")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>

          {/* Employee Revenue Report by ID */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Omset per Karyawan</h3>
              <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
                <thead>
                  <tr>
                    <th>ID Karyawan</th>
                    <th>Nama Karyawan</th>
                    <th>Omset</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeRevenue.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{formatCurrency(employee.revenue)}</td>
                      <td>
                        <MDButton
                          variant="contained"
                          color="info"
                          onClick={() => handlePrint("Omset Karyawan", employee.id)}
                        >
                          Print
                        </MDButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MDBox>
          </Grid>

          {/* Product Price Report by ID */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Harga Produk</h3>
              <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
                <thead>
                  <tr>
                    <th>ID Produk</th>
                    <th>Nama Produk</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>
                        <MDButton
                          variant="contained"
                          color="info"
                          onClick={() => handlePrint("Harga Produk", product.id)}
                        >
                          Print
                        </MDButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Report;
