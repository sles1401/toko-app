const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get products
router.get('/allRevenue', async (req, res) => {
    try {
        const query = `
    SELECT
    TO_CHAR(p.Tanggal_Penjualan, 'MM-YYYY') AS Bulan,
    SUM(p.Total_Harga) AS Total_Omzet
FROM
    Penjualan p
GROUP BY
    TO_CHAR(p.Tanggal_Penjualan, 'MM-YYYY')
ORDER BY
    TO_CHAR(p.Tanggal_Penjualan, 'MM-YYYY')
  `;
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
