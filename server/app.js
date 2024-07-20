const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to the database
let dbConnectionStatus = 'Unknown'; // Initialize connection status

connectDB().then(() => {
  dbConnectionStatus = 'Connected';
}).catch((error) => {
  dbConnectionStatus = 'Failed';
  console.error('Database connection error:', error);
});

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors({
  origin: 'https://your-frontend-url.com', // Update this with your frontend URL
  methods: ["POST", "GET"],
  credentials: true,
}));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api', contactRoutes);

// Health Check Route
app.get('/ping', (req, res) => {
  res.status(200).send('<html><body><h1>Success: Pong</h1></body></html>');
});

// Status Check Route
app.get('/status', (req, res) => {
  const statusMessage = dbConnectionStatus === 'Connected'
    ? '<html><body><h1>Success: Server is running and database is connected.</h1></body></html>'
    : '<html><body><h1>Error: Server is running, but database connection failed.</h1></body></html>';
  
  res.status(200).send(statusMessage);
});

// Logging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
