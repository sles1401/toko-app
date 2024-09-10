/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function Report() {
  const [data, setData] = useState({
    revenue: "0",
    productPrice: "0",
  });
  const [employeeRevenue, setEmployeeRevenue] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [revenueSearch, setRevenueSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeRevenueResponse = await axios.get(
          "http://localhost:5000/api/employeerevenue/getEmployeeRevenue"
        );
        setEmployeeRevenue(employeeRevenueResponse.data);

        const productsResponse = await axios.get("http://localhost:5000/api/reports/getPriceReport");
        setProducts(productsResponse.data);

        const monthlyRevenueResponse = await axios.get(
          "http://localhost:5000/api/revenue/allRevenue"
        );
        setMonthlyRevenue(monthlyRevenueResponse.data);

        setLoading(false); // Set loading to false after data is fetched
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
    console.log(`Printing ${title} with ID: ${id}`);
  };

  const handleEmployeeSearch = (e) => {
    setEmployeeSearch(e.target.value);
  };

  const handleProductSearch = (e) => {
    setProductSearch(e.target.value);
  };

  const handleRevenueSearch = (e) => {
    setRevenueSearch(e.target.value);
  };

  const filteredEmployees = employeeRevenue.filter(
    (employee) =>
      employee.name && employee.name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (product) => product.name && product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredMonthlyRevenue = monthlyRevenue.filter(
    (revenue) => revenue.month && revenue.month.toLowerCase().includes(revenueSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Monthly Revenue Report */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Omset Bulanan</h3>
              <input
                type="text"
                placeholder="Cari bulan..."
                value={revenueSearch}
                onChange={handleRevenueSearch}
                style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
              />
              {loading ? (
                <CircularProgress />
              ) : (
                <table style={{ width: "100%", textAlign: "left", borderSpacing: "0 10px" }}>
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th>Omset</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonthlyRevenue.map((revenue, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
                      >
                        <td>{revenue.bulan}</td>
                        <td>{formatCurrency(revenue.Total_Omzet)}</td>
                        <td>
                          <MDButton
                            variant="contained"
                            color="info"
                            onClick={() => handlePrint("Omset Bulanan", revenue.id)}
                          >
                            Print
                          </MDButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </MDBox>
          </Grid>

          {/* Employee Revenue Report by ID */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Omset per Karyawan</h3>
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={employeeSearch}
                onChange={handleEmployeeSearch}
                style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
              />
              {loading ? (
                <CircularProgress />
              ) : (
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
                      {filteredEmployees.map((employee, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
                        >
                          <td>{employee.id_pengguna}</td>
                          <td>{employee.nama_lengkap}</td>
                          <td>{formatCurrency(employee.Total_Omzet)}</td>
                          <td>
                            <MDButton
                              variant="contained"
                              color="info"
                              onClick={() => handlePrint("Omset Karyawan", employee.id_pengguna)}
                            >
                              Print
                            </MDButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              )}
            </MDBox>
          </Grid>


          {/* Product Price Report by ID */}
          <Grid item xs={12}>
            <MDBox>
              <h3>Laporan Harga Produk</h3>
              <input
                type="text"
                placeholder="Cari produk..."
                value={productSearch}
                onChange={handleProductSearch}
                style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
              />
              {loading ? (
                <CircularProgress />
              ) : (
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
                      {filteredProducts.map((product, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
                        >
                          <td>{product.id_produk}</td>
                          <td>{product.nama_produk}</td>
                          <td>{formatCurrency(product.harga_jual)}</td>
                          <td>
                            <MDButton
                              variant="contained"
                              color="info"
                              onClick={() => handlePrint("Harga Produk", product.id_produk)}
                            >
                              Print
                            </MDButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Report;
