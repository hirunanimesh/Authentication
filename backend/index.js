// backend/index.js
require('dotenv').config();
const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./Routes/authRouts'); // import auth routes

app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Adjust the client URL as needed
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());


app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


