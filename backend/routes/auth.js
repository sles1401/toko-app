const express = require('express');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();

// Login Route
router.post('/sign-in', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('Attempting login with:', username);

        // Fetch user data from database
        const result = await connection.execute(
            `SELECT LOGIN.ID_PENGGUNA, LOGIN.USERNAME, LOGIN.KATA_SANDI, 
                    PENGGUNA.STATUS_AKTIF, HAK_AKSES.ID_PERAN
             FROM LOGIN
             INNER JOIN PENGGUNA ON LOGIN.ID_PENGGUNA = PENGGUNA.ID_PENGGUNA
             INNER JOIN HAK_AKSES ON HAK_AKSES.ID_PERAN = LOGIN.ID_PERAN
             WHERE LOGIN.USERNAME = :username
             AND PENGGUNA.STATUS_AKTIF = 'Aktif'`,
            [username]
        );

        console.log('Query Result:', result.rows);

        // Periksa apakah hasil query memiliki data
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials or user is inactive' });
        }

        const user = result.rows[0];
        console.log('User Data:', user);

        // Hashing password menggunakan fungsi hash_password dari Oracle
        const hashResult = await connection.execute(
            `SELECT hash_password(:password) AS hashed_password FROM DUAL`,
            [password]
        );

        const hashedPassword = hashResult.rows[0][0];
        console.log('Hashed Password from Oracle:', hashedPassword);

        // Check if the hashed password matches the one in the database
        if (hashedPassword !== user[2]) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user[0], roleId: user[4] }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection:', err.message);
            }
        }
    }
});

module.exports = router;
