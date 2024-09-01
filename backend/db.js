/* eslint-disable prettier/prettier */
const express = require('express');
const oracledb = require('oracledb');
const app = express();
const port = 5000;

// Create a connection to the Oracle database
const dbConfig = {
    user: 'admin_toko',
    password: 'admin_toko',
    connectString: 'localhost:1521/xe'
};

// Fetch daily profit
app.get('/api/profit', async (req, res) => {
    const query = `SELECT SUM(dp.Subtotal - (dp.Jumlah * pr.Harga_Modal)) AS Daily_Profit
    FROM Penjualan p
    JOIN 
        Detail_Penjualan dp ON p.ID_Penjualan = dp.ID_Penjualan
    JOIN 
        Produk pr ON dp.ID_Produk = pr.ID_Produk
    WHERE 
        TRUNC(p.Tanggal_Penjualan) = TRUNC(SYSDATE)
    GROUP BY 
        p.Tanggal_Penjualan
    ORDER BY 
        p.Tanggal_Penjualan
  `;

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query);
        const amount = result.rows.length ? result.rows[0][0] : 0;
        res.json({ amount: amount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Fetch daily revenue
app.get('/api/revenue', async (req, res) => {
    const query = `
    SELECT 
        SUM(Total_Harga) AS Daily_Revenue
    FROM 
        Penjualan
    WHERE 
        TRUNC(Tanggal_Penjualan) = TRUNC(SYSDATE)
    GROUP BY 
        Tanggal_Penjualan
    ORDER BY 
        Tanggal_Penjualan
  `;

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query);
        const amount = result.rows.length ? result.rows[0][0] : 0;
        res.json({ amount: amount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Fetch daily transactions
app.get('/api/transactions', async (req, res) => {
    const query = `
    SELECT 
        COUNT(*) AS Daily_Transaction_Count
    FROM 
        Penjualan
    WHERE 
        TRUNC(Tanggal_Penjualan) = TRUNC(SYSDATE)
    GROUP BY 
        Tanggal_Penjualan
    ORDER BY 
        Tanggal_Penjualan
  `;

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query);
        const count = result.rows.length ? result.rows[0][0] : 0;
        res.json({ count: count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});