const oracledb = require('oracledb');

async function getEmployeeRevenue(req, res) {
    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(`
      SELECT PEGAWAI.NAMA AS name, SUM(TRANSAKSI.PENDAPATAN) AS revenue
      FROM TRANSAKSI
      JOIN PEGAWAI ON TRANSAKSI.PEGAWAI_ID = PEGAWAI.ID
      GROUP BY PEGAWAI.NAMA
    `);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching employee revenue:', err);
        res.status(500).send('Server Error');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function getMonthlyRevenue(req, res) {
    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(`
      SELECT SUM(PENDAPATAN) AS revenue
      FROM TRANSAKSI
      WHERE TO_CHAR(TANGGAL, 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')
    `);

        res.json(result.rows[0].REVENUE);
    } catch (err) {
        console.error('Error fetching monthly revenue:', err);
        res.status(500).send('Server Error');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function getWeeklyRevenue(req, res) {
    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(`
      SELECT SUM(PENDAPATAN) AS revenue
      FROM TRANSAKSI
      WHERE TO_CHAR(TANGGAL, 'IW') = TO_CHAR(SYSDATE, 'IW')
    `);

        res.json(result.rows[0].REVENUE);
    } catch (err) {
        console.error('Error fetching weekly revenue:', err);
        res.status(500).send('Server Error');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function getLowStockProducts(req, res) {
    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(`
      SELECT NAMA AS name, STOK AS stock
      FROM PRODUK
      WHERE STOK < 10
    `);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching low stock products:', err);
        res.status(500).send('Server Error');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    getEmployeeRevenue,
    getMonthlyRevenue,
    getWeeklyRevenue,
    getLowStockProducts,
};
