/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Tables() {
  // State for storing data fetched from API
  const [userRows, setUserRows] = useState([]);

  // Fetch user data from API when component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Return JSON if response is OK
      })
      .then((data) => {
        const formattedRows = data.map((user) => ({
          author: {
            name: user.Nama_Lengkap,
            email: user.Username,
          },
          function: {
            title: user.Nama_Peran,
            description: user.Deskripsi_Peran,
          },
          status: user.Status_Aktif === "Aktif" ? "online" : "offline",
          employed: new Date(user.Tanggal_Pendaftaran).toLocaleDateString(),
        }));
        setUserRows(formattedRows);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

  }, []);

  // Column definitions
  const columns = [
    { Header: "User", accessor: "author", width: "45%", align: "left" },
    { Header: "Function", accessor: "function", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Employed", accessor: "employed", align: "center" },
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
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: userRows }}
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

export default Tables;
