const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your DB config

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM pengguna ORDER BY id_pengguna ASC';
        const result = await db.executeQuery(query); // Ensure executeQuery is defined in your db config
        res.json(result.rows); // Return the result rows
    } catch (err) {
        console.error("Error fetching users data", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
