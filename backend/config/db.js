const oracledb = require('oracledb');
require('dotenv').config();

async function initialize() {
    await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING,
    });
}

async function close() {
    await oracledb.getPool().close(0);
}

async function executeQuery(query, binds = [], opts = {}) {
    let connection;
    opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(query, binds, opts);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = {
    initialize,
    close,
    executeQuery,
};
