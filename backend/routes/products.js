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

// Define a route to get products by ID
router.get('/getProducts/:id', async (req, res) => {
    const productId = req.params.id; // Get product ID from request parameters

    try {
        // Define the query with parameter placeholder
        const query = `
            SELECT * FROM produk INNER JOIN
                kategori ON produk.id_kategori = kategori.id_kategori
                INNER JOIN satuan ON satuan.id_satuan = produk.id_satuan
                INNER JOIN stok ON stok.id_produk = produk.id_produk
            WHERE produk.id_produk = :id
        `;

        // Execute the query with the product ID parameter
        const result = await db.executeQuery(query, { id: productId });

        // Check if product data is found
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Send the first row of the result as JSON
        } else {
            res.status(404).send('Product not found'); // Handle case where no product is found
        }
    } catch (err) {
        console.error('Error fetching product data:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Define a route to get products by ID
router.get('/getProducts/:id', async (req, res) => {
    const productId = req.params.id; // Get product ID from request parameters

    try {
        // Define the query with parameter placeholder
        const query = `
            SELECT * FROM produk INNER JOIN
                kategori ON produk.id_kategori = kategori.id_kategori
                INNER JOIN satuan ON satuan.id_satuan = produk.id_satuan
                INNER JOIN stok ON stok.id_produk = produk.id_produk
            WHERE produk.id_produk = :id
        `;

        // Execute the query with the product ID parameter
        const result = await db.executeQuery(query, { id: productId });

        // Check if product data is found
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Send the first row of the result as JSON
        } else {
            res.status(404).send('Product not found'); // Handle case where no product is found
        }
    } catch (err) {
        console.error('Error fetching product data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to update product by ID
router.put('/updateProduct/:id', async (req, res) => {
    const productId = req.params.id; // ID produk yang akan di-update
    const {
        NAMA_PRODUK,
        NAMA_KATEGORI,
        NAMA_SATUAN,
        JUMLAH_STOK,
        HARGA_JUAL,
        HARGA_MODAL,
        DESKRIPSI
    } = req.body; // Data produk dari request body

    // Convert numeric fields to numbers and validate
    const parsedHargaJual = HARGA_JUAL !== undefined ? parseFloat(HARGA_JUAL) : undefined;
    const parsedHargaModal = HARGA_MODAL !== undefined ? parseFloat(HARGA_MODAL) : undefined;
    const parsedJumlahStok = JUMLAH_STOK !== undefined ? parseInt(JUMLAH_STOK, 10) : undefined;

    // Logging for debugging
    console.log('Parsed Values:', { parsedHargaJual, parsedHargaModal, parsedJumlahStok });

    if (isNaN(parsedHargaJual) || isNaN(parsedHargaModal) || isNaN(parsedJumlahStok)) {
        return res.status(400).send('Invalid number format in request data');
    }

    let connection;

    try {
        connection = await db.getConnection(); // Ensure you are obtaining a connection

        // Get current product data
        const queryCurrentData = `
            SELECT 
                Nama_Produk,
                ID_Kategori,
                ID_Satuan,
                Harga_Jual AS harga_jual,
                Harga_Modal AS harga_modal,
                Stok.Jumlah_Stok AS jumlah_stok 
            FROM Produk 
            JOIN Stok ON Produk.ID_Produk = Stok.ID_Produk 
            WHERE Produk.ID_Produk = :productId
        `;
        const resultCurrentData = await connection.execute(queryCurrentData, [productId]);
        const currentData = resultCurrentData.rows[0];

        if (!currentData) {
            throw new Error('Product not found');
        }

        // Check if price or stock has changed
        const isPriceChanged = (parsedHargaModal !== undefined && parsedHargaModal !== currentData.harga_modal) ||
            (parsedHargaJual !== undefined && parsedHargaJual !== currentData.harga_jual);
        const isStockChanged = parsedJumlahStok !== undefined && parsedJumlahStok !== currentData.jumlah_stok;

        // Update product if needed
        if (NAMA_PRODUK || NAMA_KATEGORI || NAMA_SATUAN || parsedHargaJual || parsedHargaModal || DESKRIPSI) {
            let id_kategori = currentData.ID_Kategori;
            let id_satuan = currentData.ID_Satuan;

            if (NAMA_KATEGORI) {
                // Query to get category ID by name
                const queryCategory = 'SELECT ID_Kategori FROM Kategori WHERE Nama_Kategori = :NAMA_KATEGORI';
                const resultCategory = await connection.execute(queryCategory, [NAMA_KATEGORI]);
                id_kategori = resultCategory.rows[0] ? resultCategory.rows[0].ID_Kategori : id_kategori;

                if (!id_kategori) {
                    throw new Error('Category not found');
                }
            }

            if (NAMA_SATUAN) {
                // Query to get unit ID by name
                const queryUnit = 'SELECT ID_Satuan FROM Satuan WHERE Nama_Satuan = :NAMA_SATUAN';
                const resultUnit = await connection.execute(queryUnit, [NAMA_SATUAN]);
                id_satuan = resultUnit.rows[0] ? resultUnit.rows[0].ID_Satuan : id_satuan;

                if (!id_satuan) {
                    throw new Error('Unit not found');
                }
            }

            // Update the product information
            const queryUpdateProduct = `
                UPDATE Produk
                SET 
                    Nama_Produk = NVL(:NAMA_PRODUK, Nama_Produk),
                    ID_Kategori = NVL(:ID_KATEGORI, ID_Kategori),
                    ID_Satuan = NVL(:ID_SATUAN, ID_Satuan),
                    Harga_Jual = NVL(:HARGA_JUAL, Harga_Jual),
                    Harga_Modal = NVL(:HARGA_MODAL, Harga_Modal),
                    Deskripsi = NVL(:DESKRIPSI, Deskripsi)
                WHERE ID_Produk = :ID_PRODUK
            `;
            await connection.execute(queryUpdateProduct, {
                NAMA_PRODUK,
                ID_KATEGORI: id_kategori,
                ID_SATUAN: id_satuan,
                HARGA_JUAL: parsedHargaJual,
                HARGA_MODAL: parsedHargaModal,
                DESKRIPSI,
                ID_PRODUK: productId
            }, { autoCommit: false });

            // Update stock if changed
            if (isStockChanged) {
                const queryUpdateStock = `
                    UPDATE Stok
                    SET 
                        Jumlah_Stok = :JUMLAH_STOK,
                        Tanggal_Update = SYSDATE
                    WHERE ID_Produk = :ID_PRODUK
                `;
                await connection.execute(queryUpdateStock, {
                    JUMLAH_STOK: parsedJumlahStok,
                    ID_PRODUK: productId
                }, { autoCommit: false });

                // Insert stock change record
                const queryInsertStockChange = `
                    INSERT INTO Perubahan_Stok (
                        ID_Perubahan_Stok, ID_Stok, Jumlah_Perubahan, Tipe_Perubahan, Deskripsi, Tanggal_Perubahan
                    )
                    VALUES (
                        seq_ID_Perubahan_Stok.nextval,
                        seq_ID_Stok.nextval,
                        :JUMLAH_PERUBAHAN,
                        :TIPE_PERUBAHAN,
                        :DESKRIPSI,
                        SYSDATE
                    )
                `;
                try {
                    await connection.execute(queryInsertStockChange, {
                        ID_PRODUK: productId,
                        JUMLAH_PERUBAHAN: parsedJumlahStok - currentData.jumlah_stok,
                        TIPE_PERUBAHAN: parsedJumlahStok > currentData.jumlah_stok ? 'restock' : 'penjualan',
                        DESKRIPSI: 'Update stock'
                    }, { autoCommit: false });
                    console.log('Stock change record inserted successfully');
                } catch (error) {
                    console.error('Error inserting stock change record:', error);
                    throw error; // Rethrow to ensure it's handled in the main catch block
                }
            }

            // Insert price change record
            if (isPriceChanged) {
                const queryInsertPriceChange = `
                    INSERT INTO Perubahan_Harga (
                        ID_Perubahan_Harga, ID_Produk, Tanggal_Perubahan, Harga_Baru
                    )
                    VALUES (
                        seq_ID_Perubahan_Harga.nextval,
                        :ID_PRODUK,
                        SYSDATE,
                        :HARGA_BARU
                    )
                `;
                await connection.execute(queryInsertPriceChange, {
                    ID_PRODUK: productId,
                    HARGA_BARU: parsedHargaJual
                }, { autoCommit: false });
            }

            // Commit transaction
            await connection.commit();
            res.status(200).send('Product updated successfully');
        } else {
            res.status(200).send('No changes detected');
        }
    } catch (err) {
        console.error('Error updating product:', err);
        try {
            await connection.rollback(); // Rollback transaction on error
        } catch (rollbackErr) {
            console.error('Error rolling back transaction:', rollbackErr);
        }
        res.status(500).send(`Internal Server Error: ${err.message}`);
    } finally {
        // Release the connection
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error('Error closing connection:', closeErr);
            }
        }
    }
});

module.exports = router;
