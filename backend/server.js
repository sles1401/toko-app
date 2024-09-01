/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const oracledb = require('oracledb');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Route to fetch dashboard stats
app.get('/api/dashboard-stats', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`
            SELECT 
                (SELECT COUNT(*) FROM transaksi) AS transaksi,
                (SELECT SUM(total) FROM transaksi) AS pendapatan,
                (SELECT SUM(laba) FROM laba_view) AS laba
            FROM dual
        `);

        const [stats] = result.rows;

        res.json({
            transaksi: stats[0],
            pendapatan: stats[1],
            laba: stats[2]
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing Oracle connection', err);
            }
        }
    }
});

db.initialize()
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => {
        console.error('Failed to start server', err);
        process.exit(1);
    });

process.on('SIGINT', () => {
    db.close().then(() => process.exit(0)).catch(err => {
        console.error('Failed to close database connection', err);
        process.exit(1);
    });
});
