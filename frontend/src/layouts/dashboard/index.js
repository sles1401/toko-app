/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState({
    transactions: 0,
    revenue: '0',
    profit: '0',
    productCount: 0,
    userCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        console.log('API Response:', response.data);

        // Updated destructuring to match API response keys
        const { TRANSAKSI, PENDAPATAN, LABA, JUMLAH_PRODUK, JUMLAH_PENGGUNA } = response.data;
        console.log('Extracted Data:', { TRANSAKSI, PENDAPATAN, LABA, JUMLAH_PRODUK, JUMLAH_PENGGUNA });

        setData({
          transactions: TRANSAKSI || 0, // Ensure transactions is a number
          revenue: formatCurrency(PENDAPATAN), // Format revenue
          profit: formatCurrency(LABA), // Format profit
          productCount: JUMLAH_PRODUK || 0, // Ensure product count is a number
          userCount: JUMLAH_PENGGUNA || 0  // Ensure user count is a number
        });
      }
      catch (error) {
        console.error("Error fetching data from http://localhost:5000/api/dashboard:", error.response ? error.response.data : error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    };

    fetchData();
  }, []);

  // Helper function to format currency
  function formatCurrency(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      return `Rp. ${value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`;
    }
    return 'Rp. 0'; // Default value if not a valid number
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="shopping_cart"
                title="Transaksi"
                count={data.transactions}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Hari Ini"
                }}
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
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Hari Ini"
                }}
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
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Hari Ini"
                }}
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
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total Produk"
                }}
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
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total Pengguna"
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
