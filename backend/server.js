import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import News from './models/News.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'Sibi1970';

// Enhanced CORS Configuration
const allowedOrigins = [
  'http://localhost:5176', // Dev
  'https://www.khrdt.in', // Production
  'https://khrdt.in' // Alternate domain
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions)); // Global OPTIONS handler

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authorization token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/departments', (req, res) => {
  res.json({
    status: "success",
    data: {
      "Hero stones": {
        en: { title: "Test Hero Stones" },
        ta: { title: "சோதனை வீரக்கல்" }
      },
      "Rock paintings": {
        en: { title: "Rock Paintings" },
        ta: { title: "பாறை ஓவியங்கள்" }
      }
    }
  });
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// News Endpoints
app.get('/api/news', async (req, res) => {
  try {
    const newsItems = await News.find().sort({ createdAt: -1 }).lean();
    const response = {
      status: 'success',
      count: newsItems.length,
      data: newsItems.map(item => ({
        ...item,
        id: item._id.toString()
      })),
      timestamp: new Date()
    };
    res.json(response);
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Failed to fetch news',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const newNews = new News({
      ...req.body,
      createdBy: req.user.userId
    });
    
    const savedNews = await newNews.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        ...savedNews.toObject(),
        id: savedNews._id.toString()
      }
    });
  } catch (error) {
    console.error('News creation error:', error);
    res.status(400).json({
      status: 'error',
      error: 'Invalid news data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Database Initialization
const initializeDB = async () => {
  try {
    const count = await News.countDocuments();
    console.log(`News collection contains ${count} documents`);

    if (count === 0) {
      await News.create({
        en: {
          title: 'Ancient Pottery Unearthed in Krishnagiri',
          description: 'Archaeologists have discovered significant pottery fragments...',
          image: '/images/news1.jpeg'
        },
        ta: {
          title: 'கிருஷ்ணகிரியில் பழங்கால பானைகள் கண்டுபிடிப்பு',
          description: 'சங்க காலத்தைச் சேர்ந்த குறிப்பிடத்தக்க பானை ஓடுகளை...',
          image: '/images/news1_ta.jpeg'
        }
      });
      console.log('Initial test news item created');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

mongoose.connection.once('open', initializeDB);

// Server Start
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET  /api/health`);
  console.log(`- GET  /api/departments`);
  console.log(`- POST /api/login`);
  console.log(`- GET  /api/news`);
  console.log(`- POST /api/news (protected)`);
  console.log(`- PUT  /api/news/:id (protected)`);
  console.log(`- DELETE /api/news/:id (protected)`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server and database connections closed');
      process.exit(0);
    });
  });
});