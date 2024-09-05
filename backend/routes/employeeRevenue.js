const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get products
router.get('/getEmployeeRevenue', async (req, res) => {
    try {
        const query = `
    SELECT
    p.ID_Pengguna,
    pg.Nama_Lengkap,
    SUM(p.Total_Harga) AS Total_Omzet
FROM
    Penjualan p
    JOIN Pengguna pg ON p.ID_Pengguna = pg.ID_Pengguna
GROUP BY
    p.ID_Pengguna,
    pg.Nama_Lengkap
ORDER BY
    Total_Omzet DESC
  `;
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
