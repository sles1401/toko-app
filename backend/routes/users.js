const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get users
router.get('/getUsers', async (req, res) => {
    try {
        const query = 'SELECT * FROM PENGGUNA ORDER BY ID_PENGGUNA ASC';
        const result = await db.executeQuery(query);
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching users data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to add a new user
router.post('/addUser', async (req, res) => {
    const { nama_lengkap, alamat, telepon } = req.body;

    // Validate input
    if (!nama_lengkap || !alamat || !telepon) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO PENGGUNA (ID_PENGGUNA, NAMA_LENGKAP, ALAMAT, NOMOR_TELEPON, TANGGAL_PENDAFTARAN, STATUS_AKTIF)
        VALUES (seq_ID_Pengguna.NEXTVAL, :nama_lengkap, :alamat, :telepon, SYSDATE, 'Aktif')
    `;
    const params = { nama_lengkap, alamat, telepon };

    try {
        await db.executeQuery(query, params);
        res.status(201).send('User added successfully');
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to edit a user
router.put('/editUser/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_lengkap, alamat, telepon, status_aktif } = req.body;

    // Validate input - ensure ID is provided
    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Build the dynamic query and parameters based on provided fields
    let query = 'UPDATE PENGGUNA SET';
    let params = {};
    let fields = [];

    if (nama_lengkap) {
        fields.push('NAMA_LENGKAP = :nama_lengkap');
        params.nama_lengkap = nama_lengkap;
    }
    if (alamat) {
        fields.push('ALAMAT = :alamat');
        params.alamat = alamat;
    }
    if (telepon) {
        fields.push('NOMOR_TELEPON = :telepon');
        params.telepon = telepon;
    }
    if (status_aktif) {
        fields.push('STATUS_AKTIF = :status_aktif');
        params.status_aktif = status_aktif;
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Join fields with commas and append WHERE clause
    query += ' ' + fields.join(', ') + ' WHERE ID_PENGGUNA = :id';
    params.id = id;

    try {
        // For debugging: Log the query and parameters
        console.log('Executing query:', query);
        console.log('With parameters:', params);

        const result = await db.executeQuery(query, params);
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send('User updated successfully');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to delete a user
router.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;

    // Check if the ID is provided
    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const query = 'DELETE FROM PENGGUNA WHERE ID_PENGGUNA = :id';
    const params = { id };

    try {
        // Execute the DELETE query
        const result = await db.executeQuery(query, params);

        // Check if any rows were affected
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.send('User deleted successfully');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
