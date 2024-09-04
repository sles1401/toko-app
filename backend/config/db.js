// config/db.js
const oracledb = require('oracledb');
require('dotenv').config();

async function initialize() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING,
            poolAlias: 'default'  // This line specifies the alias
        });
        console.log("Database connection pool created");
    } catch (err) {
        console.error("Error creating database connection pool", err);
        process.exit(1);
    }
}

async function close() {
    try {
        await oracledb.getPool().close(0);
        console.log("Database connection pool closed");
    } catch (err) {
        console.error("Error closing database connection pool", err);
    }
}

async function executeQuery(query, binds = [], opts = {}) {
    let connection;
    opts.outFormat = oracledb.OUT_FORMAT_OBJECT;

    try {
        connection = await oracledb.getConnection('default'); // Use the alias
        const result = await connection.execute(query, binds, opts);
        return result;
    } catch (err) {
        console.error("Error executing query", err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection", err);
            }
        }
    }
}

async function getConnection() {
    try {
        return await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });
    } catch (err) {
        console.error('Error getting OracleDB connection', err);
        throw err;
    }
}

module.exports = {
    initialize,
    close,
    executeQuery,
    getConnection,
};
