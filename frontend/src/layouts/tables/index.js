/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik, Field, Form } from 'formik';

function Tables() {
  const [userRows, setUserRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    nama_lengkap: '',
    alamat: '',
    telepon: ''
  });
  const [editUser, setEditUser] = useState({
    id: '',
    nama_lengkap: '',
    alamat: '',
    telepon: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/getUsers');
        const data = response.data;

        const formattedRows = data.map((user) => ({
          id: user.ID_PENGGUNA,
          author: user.NAMA_LENGKAP,
          alamat: user.ALAMAT,
          telepon: user.TELEPON,
          status: user.STATUS_AKTIF === "Aktif" ? "online" : "offline",
          employed: new Date(user.TANGGAL_PENDAFTARAN).toLocaleDateString(),
        }));

        setUserRows(formattedRows);
        setFilteredRows(formattedRows);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = userRows.filter(row =>
      row.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
  }, [searchTerm, userRows]);

  const columns = [
    { Header: "ID", accessor: "id", width: "10%", align: "left" },
    { Header: "User", accessor: "author", width: "30%", align: "left" },
    { Header: "Address", accessor: "alamat", width: "25%", align: "left" },
    { Header: "Phone", accessor: "telepon", width: "20%", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Employed", accessor: "employed", align: "center" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ cell }) => (
        <div>
          <Button onClick={() => handleClickOpenEdit(cell.row.original)} color="warning">
            Edit
          </Button>
          <Button onClick={() => handleDelete(cell.row.original.id)} color="error">
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = document.getElementById('printableTable').innerHTML;
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;} th {background-color: #f2f2f2;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleClickOpenAdd = () => {
    setOpenAddDialog(true);
  };

  const handleClickOpenEdit = (user) => {
    setEditUser({
      id: user.id,
      nama_lengkap: user.author,
      alamat: user.alamat,
      telepon: user.telepon
    });
    setOpenEditDialog(true);
  };

  const handleCloseAdd = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  const handleSubmitAdd = async (values) => {
    console.log('Submitting:', values); // Log the values
    try {
      await axios.post('http://localhost:5000/api/users/addUser', values);
      handleCloseAdd();
      await refreshData();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }
  };

  const handleSubmitEdit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/users/updateUser/${values.id}`, values);
      handleCloseEdit();
      await refreshData();
    } catch (error) {
      console.error("There was a problem with the submit operation:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/deleteUser/${id}`);
      await refreshData();
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/getUsers');
      const data = response.data;
      const formattedRows = data.map((user) => ({
        id: user.ID_PENGGUNA,
        author: user.NAMA_LENGKAP,
        alamat: user.ALAMAT,
        telepon: user.TELEPON,
        status: user.STATUS_AKTIF === "Aktif" ? "online" : "offline",
        employed: new Date(user.TANGGAL_PENDAFTARAN).toLocaleDateString(),
      }));
      setUserRows(formattedRows);
      setFilteredRows(formattedRows);
    } catch (error) {
      console.error("There was a problem with the refresh operation:", error);
    }
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
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <div className="search-and-print-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, marginRight: '1rem' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    style={{ color: 'white' }}
                  >
                    Print
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleClickOpenAdd}
                    style={{ marginLeft: '1rem' }}
                  >
                    Add User
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

      {/* Dialog for adding a new user */}
      <Dialog open={openAddDialog} onClose={handleCloseAdd}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={newUser}
            onSubmit={handleSubmitAdd}
          >
            {({ values, handleChange }) => (
              <Form>
                <TextField
                  label="Full Name"
                  name="nama_lengkap"
                  variant="outlined"
                  fullWidth
                  value={values.nama_lengkap}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Address"
                  name="alamat"
                  variant="outlined"
                  fullWidth
                  value={values.alamat}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  name="telepon"
                  variant="outlined"
                  fullWidth
                  value={values.telepon}
                  onChange={handleChange}
                  margin="normal"
                />
                <DialogActions>
                  <Button onClick={handleCloseAdd} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a user */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editUser}
            onSubmit={handleSubmitEdit}
          >
            {({ values, handleChange }) => (
              <Form>
                <TextField
                  label="Full Name"
                  name="nama_lengkap"
                  variant="outlined"
                  fullWidth
                  value={values.nama_lengkap}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Address"
                  name="alamat"
                  variant="outlined"
                  fullWidth
                  value={values.alamat}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  name="telepon"
                  variant="outlined"
                  fullWidth
                  value={values.telepon}
                  onChange={handleChange}
                  margin="normal"
                />
                <DialogActions>
                  <Button onClick={handleCloseEdit} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
