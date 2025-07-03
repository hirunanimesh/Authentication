require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the pool connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database with connection pool');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

module.exports = pool;
