const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get products
router.get('/paymentMethods', async (req, res) => {
    try {
        const query = `
        SELECT *
        FROM Metode_Pembayaran
        `;
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching products data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
