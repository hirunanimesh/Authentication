// backend/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db'); // import pool connection

app.use(cors());
app.use(express.json());

// Define a simple route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT 1 as test');
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




