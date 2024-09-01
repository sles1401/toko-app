/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Route to fetch dashboard stats
app.get('/api/dashboard-stats', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'admin_toko',
            password: 'admin_toko',
            connectString: 'localhost:1521/xe'
        });

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    process.exit(0);
});
