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
    revenue: 'Rp. 0',
    profit: 'Rp. 0'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from the backend API
        const [transactionsRes, revenueRes, profitRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/revenue'),
          axios.get('/api/profit')
        ]);

        // Update state with the fetched data
        setData({
          transactions: transactionsRes.data.count,
          revenue: `Rp. ${revenueRes.data.amount}`,
          profit: `Rp. ${profitRes.data.amount}`
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
