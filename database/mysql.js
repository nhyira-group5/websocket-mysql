const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.MYSQL_SERVER,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT, 10)
};

const poolPromise = (async () => {
    try {
        const pool = mysql.createPool(config);
        const connection = await pool.getConnection();
        console.log('Connected to MySQL');
        connection.release(); // Libere a conexão após a verificação
        return pool;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    }
})();

module.exports = {
    mysql, poolPromise
};
