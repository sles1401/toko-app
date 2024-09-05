// routes/profile.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get user profile by ID
router.get('/:id', async (req, res) => {
    const idPengguna = req.params.id;
    const query = `
        SELECT
            p.ID_Pengguna,
            p.Nama_Lengkap AS nama,
            p.Alamat AS alamat,
            p.Nomor_Telepon AS nomor_telepon,
            p.Tanggal_Pendaftaran AS tanggal_pendaftaran,
            p.Status_Aktif AS status_aktif,
            l.Username AS username,
            ha.Nama_Peran AS hak_akses
        FROM
            Pengguna p
            JOIN Login l ON p.ID_Pengguna = l.ID_Pengguna
            JOIN Hak_Akses ha ON l.ID_Peran = ha.ID_Peran
        WHERE
            p.ID_Pengguna = :idPengguna
    `;

    try {
        const result = await db.executeQuery(query, [idPengguna]); // Pass ID as parameter
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Send the first row of result
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
