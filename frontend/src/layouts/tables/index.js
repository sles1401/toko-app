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
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Define the ActionsCell component with prop types
const ActionsCell = ({ cell, onEdit, onDelete }) => (
  <div>
    <Button
      onClick={() => onEdit(cell.row.original)}
      color="warning"
      aria-label="Edit"
    >
      Edit
    </Button>
    <Button
      onClick={() => onDelete(cell.row.original.id)} // Ensure onDelete is defined
      color="error"
      aria-label="Delete"
    >
      Delete
    </Button>
  </div>
);

ActionsCell.propTypes = {
  cell: PropTypes.shape({
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.number.isRequired,
        author: PropTypes.string.isRequired,
        alamat: PropTypes.string.isRequired,
        telepon: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        employed: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired // Ensure onDelete is defined
};
s
function Tables() {
  const [userRows, setUserRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
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
          telepon: user.NOMOR_TELEPON,
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
      Cell: ActionsCell
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

  const handleClickOpenAdd = () => setOpenAddDialog(true);

  const handleClickOpenEdit = (user) => {
    setEditUser({
      id: user.id,
      nama_lengkap: user.author,
      alamat: user.alamat,
      telepon: user.telepon
    });
    setOpenEditDialog(true);
  };

  const handleOpenConfirmDialog = (id) => {
    setSelectedUserId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseAdd = () => setOpenAddDialog(false);

  const handleCloseEdit = () => setOpenEditDialog(false);

  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleSubmitAdd = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/users/addUser', values);
      handleCloseAdd();
      await refreshData();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleSubmitEdit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/users/updateUser/${values.id}`, values);
      handleCloseEdit();
      await refreshData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedUserId) {
        await axios.delete(`http://localhost:5000/api/users/deleteUser/${selectedUserId}`);
        await refreshData();
        setOpenConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
        telepon: user.NOMOR_TELEPON,
        status: user.STATUS_AKTIF === "Aktif" ? "online" : "offline",
        employed: new Date(user.TANGGAL_PENDAFTARAN).toLocaleDateString(),
      }));
      setUserRows(formattedRows);
      setFilteredRows(formattedRows);
    } catch (error) {
      console.error("Error refreshing data:", error);
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
                    aria-label="Search"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    style={{ color: 'white' }}
                    aria-label="Print"
                  >
                    Print
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleClickOpenAdd}
                    style={{ marginLeft: '1rem' }}
                    aria-label="Add User"
                  >
                    Add User
                  </Button>
                </div>
                <MDBox pt={3}>
                  <div id="printableTable">
                    <DataTable
                      table={{ columns, rows: filteredRows }}
                      isSorted={false}
                      canSearch={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                      // Ensure you are passing onEdit and onDelete functions here
                      onEdit={handleClickOpenEdit}
                      onDelete={handleOpenConfirmDialog} // Make sure this function is defined and passed
                    />

                  </div>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAdd}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={newUser}
            onSubmit={handleSubmitAdd}
          >
            <Form>
              <Field
                as={TextField}
                name="nama_lengkap"
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="alamat"
                label="Address"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="telepon"
                label="Phone"
                fullWidth
                margin="normal"
                variant="outlined"
                required
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
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editUser}
            onSubmit={handleSubmitEdit}
          >
            <Form>
              <Field
                as={TextField}
                name="nama_lengkap"
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="alamat"
                label="Address"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="telepon"
                label="Phone"
                fullWidth
                margin="normal"
                variant="outlined"
                required
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
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
