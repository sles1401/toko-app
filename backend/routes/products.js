const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get products
router.get('/getProducts', async (req, res) => {
    try {
        const query = `
        SELECT *
        FROM produk 
        INNER JOIN kategori ON produk.id_kategori = kategori.id_kategori
        INNER JOIN satuan ON satuan.id_satuan = produk.id_satuan
        INNER JOIN stok ON stok.id_produk = produk.id_produk
        `;
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
