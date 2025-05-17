require('dotenv').config();
const express = require('express');
const cors = require('cors');
const departmentsData = require('./data/departments');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5174', // Your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

// 2. LOGGING MIDDLEWARE (Custom example)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  
  // 3. ROUTES
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to KHRDT Backend!' });
  });
  
  // Departments endpoint
app.get('/api/departments', (req, res) => {
    try {
      res.json({
        success: true,
        data: departmentsData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  });

  // 4. ERROR HANDLING MIDDLEWARE (comes after all routes)
// This catches 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  // This catches other errors
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







