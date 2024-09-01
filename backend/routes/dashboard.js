const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get dashboard statistics
router.get('/', async (req, res) => {
    try {
        const result = await db.executeQuery(`
            SELECT 
                (SELECT COUNT(*) FROM transaksi) AS transaksi,
                (SELECT SUM(total) FROM transaksi) AS pendapatan,
                (SELECT SUM(laba) FROM laba_view) AS laba,
                (SELECT COUNT(*) FROM produk) AS jumlah_produk,
                (SELECT COUNT(*) FROM users) AS jumlah_pengguna
            FROM dual
        `);

        if (result && result.rows) {
            const stats = result.rows[0]; // Assuming only one row is returned
            res.json({
                transaksi: stats[0],
                pendapatan: stats[1],
                laba: stats[2],
                jumlah_produk: stats[3],
                jumlah_pengguna: stats[4]
            });
        } else {
            res.status(404).json({ error: 'No data found' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
