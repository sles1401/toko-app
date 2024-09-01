// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM Penjualan WHERE TRUNC(Tanggal_Penjualan) = TRUNC(SYSDATE)) AS transaksi,
                (SELECT SUM(Total_Harga) FROM Penjualan WHERE TRUNC(Tanggal_Penjualan) = TRUNC(SYSDATE)) AS pendapatan,
                (SELECT SUM(dp.Subtotal - (dp.Jumlah * pr.Harga_Modal)) FROM Penjualan p JOIN Detail_Penjualan dp ON p.ID_Penjualan = dp.ID_Penjualan JOIN Produk pr ON dp.ID_Produk = pr.ID_Produk WHERE TRUNC(p.Tanggal_Penjualan) = TRUNC(SYSDATE)) AS laba,
                (SELECT COUNT(*) FROM produk) AS jumlah_produk,
                (SELECT COUNT(*) FROM pengguna) AS jumlah_pengguna
            FROM dual
        `;

        const result = await db.executeQuery(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching dashboard data", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
