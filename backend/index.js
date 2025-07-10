// backend/index.js
require('dotenv').config();
const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./Routes/authRouts'); // import auth routes
const passport = require('./Config/passport');
const session = require('express-session');

app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Adjust the client URL as needed
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());


// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Add this to your .env file
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());




app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


