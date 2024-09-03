// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path if needed

// Define a route to get users
router.get('/getUsers', async (req, res) => {
    try {
        const query = 'SELECT * FROM pengguna ORDER BY id_pengguna ASC';
        const result = await db.executeQuery(query); // Ensure this method matches your database config
        res.json(result.rows); // Send the data as JSON
    } catch (err) {
        console.error('Error fetching users data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
