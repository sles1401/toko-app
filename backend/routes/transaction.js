const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../config/db');

// Add a new transaction using the stored procedure
router.post("/", async (req, res) => {
    const { idPengguna, totalHarga, idProdukArr, jumlahArr, idMetodePembayaran } = req.body;

    try {
        const connection = await db.getConnection();

        // Menjalankan prosedur tambah_transaksi dengan binding parameter yang benar
        const result = await connection.execute(
            `
            BEGIN
              tambah_transaksi(:idPengguna, :totalHarga, :idProdukArr, :jumlahArr, :idMetodePembayaran);
            END;
            `,
            {
                idPengguna: { val: idPengguna, dir: oracledb.BIND_IN, type: oracledb.NUMBER },
                totalHarga: { val: totalHarga, dir: oracledb.BIND_IN, type: oracledb.NUMBER },
                idProdukArr: { val: idProdukArr, dir: oracledb.BIND_IN, type: oracledb.STRING, maxArraySize: idProdukArr.length },
                jumlahArr: { val: jumlahArr, dir: oracledb.BIND_IN, type: oracledb.NUMBER, maxArraySize: jumlahArr.length },
                idMetodePembayaran: { val: idMetodePembayaran, dir: oracledb.BIND_IN, type: oracledb.NUMBER }
            }
        );

        res.status(201).json({
            message: "Transaction added successfully",
            result: result
        });

    } catch (error) {
        console.error("Failed to add transaction", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        try {
            if (connection) {
                await connection.close();
            }
        } catch (err) {
            console.error("Error closing the connection", err);
        }
    }
});

module.exports = router;
