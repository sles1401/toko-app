const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get products
router.get('/getPriceReport', async (req, res) => {
    try {
        const query = `
    SELECT
      p.ID_Produk,
      p.Nama_Produk,
      p.Harga_Jual,
      p.Harga_Modal,
      s.Jumlah_Stok AS Quantity
    FROM
      Produk p
      JOIN Stok s ON p.ID_Produk = s.ID_Produk
    ORDER BY
      p.Nama_Produk
  `;
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
