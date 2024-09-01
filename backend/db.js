/* eslint-disable prettier/prettier */
const oracledb = require('oracledb');

const config = {
    user: 'admin_toko',
    password: 'admin_toko',
    connectString: 'localhost:1521/xe'
};

let connection;

async function initialize() {
    connection = await oracledb.getConnection(config);
}

async function close() {
    if (connection) {
        await connection.close();
    }
}

module.exports = {
    initialize,
    close
};
