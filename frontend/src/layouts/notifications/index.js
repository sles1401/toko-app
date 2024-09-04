/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";
import axios from 'axios';

function Report() {
  const [data, setData] = useState({
    transactions: 0,
    revenue: '0',
    profit: '0',
    productCount: 0,
    userCount: 0,
  });

  const [employeeRevenue, setEmployeeRevenue] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        const { TRANSAKSI, PENDAPATAN, LABA, JUMLAH_PRODUK, JUMLAH_PENGGUNA } = response.data;

        setData({
          transactions: TRANSAKSI || 0,
          revenue: formatCurrency(PENDAPATAN),
          profit: formatCurrency(LABA),
          productCount: JUMLAH_PRODUK || 0,
          userCount: JUMLAH_PENGGUNA || 0,
        });

        const employeeRevenueResponse = await axios.get('http://localhost:5000/api/employee-revenue');
        setEmployeeRevenue(employeeRevenueResponse.data);

        const lowStockResponse = await axios.get('http://localhost:5000/api/low-stock-products');
        setLowStockProducts(lowStockResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function formatCurrency(value) {
    return `Rp. ${Number(value).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`;
  }

  const handlePrint = (title) => {
    window.print();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="shopping_cart"
                title="Transaksi"
                count={data.transactions}
                percentage={{ color: "success", amount: "", label: "Hari Ini" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Transaksi")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="attach_money"
                title="Pendapatan"
                count={data.revenue}
                percentage={{ color: "success", amount: "", label: "Hari Ini" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Pendapatan")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="trending_up"
                title="Laba"
                count={data.profit}
                percentage={{ color: "success", amount: "", label: "Hari Ini" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Laba")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="inventory_2"
                title="Jumlah Produk"
                count={data.productCount}
                percentage={{ color: "success", amount: "", label: "Total Produk" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Jumlah Produk")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Jumlah Pengguna"
                count={data.userCount}
                percentage={{ color: "success", amount: "", label: "Total Pengguna" }}
                action={
                  <MDButton
                    variant="contained"
                    color="info"
                    onClick={() => handlePrint("Jumlah Pengguna")}
                    fullWidth
                    style={{ marginTop: "10px" }}
                  >
                    Print
                  </MDButton>
                }
              />
            </MDBox>
          </Grid>

          {/* Employee Revenue Report */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Pendapatan per Pegawai</h3>
              <table style={{ width: '100%', textAlign: 'left', borderSpacing: '0 10px' }}>
                <thead>
                  <tr>
                    <th>Nama Pegawai</th>
                    <th>Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeRevenue.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.name}</td>
                      <td>{formatCurrency(employee.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <MDButton
                variant="contained"
                color="info"
                onClick={() => handlePrint("Laporan Pendapatan per Pegawai")}
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Print
              </MDButton>
            </MDBox>
          </Grid>

          {/* Low Stock Report */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Stok Produk Menipis</h3>
              <table style={{ width: '100%', textAlign: 'left', borderSpacing: '0 10px' }}>
                <thead>
                  <tr>
                    <th>Nama Produk</th>
                    <th>Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <MDButton
                variant="contained"
                color="info"
                onClick={() => handlePrint("Laporan Stok Produk Menipis")}
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Print
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Report;
