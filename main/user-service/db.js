const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pastebin',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT || '500'),
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
  .then(conn => {
    console.log("MySQL connected !");
    conn.release();
  })
  .catch(err => {
    console.error("MySQL connection error:", err);
  });

module.exports = pool;
