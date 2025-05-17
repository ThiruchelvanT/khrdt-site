import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import itemRoutes from './routes/items.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware (must come before routes)
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5181',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => { 
  res.json({ 
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/items', itemRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000 // 45 seconds socket timeout
    });
    console.log('MongoDB connected to:', mongoose.connection.db.databaseName);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    server.setTimeout(5000);
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};

// Start the server
startServer();