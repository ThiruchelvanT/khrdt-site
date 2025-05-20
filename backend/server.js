import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import News from './models/News.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'Sibi1970';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create images directory if not exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  try {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log("Images directory created at:", imagesDir);
  } catch (error) {
    console.error("Failed to create images directory:", error);
    process.exit(1);
  }
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});



// CORS configuration
const allowedOrigins = [
  'http://localhost:5176',
  'https://www.khrdt.in',
  'https://khrdt.in',
  'https://khrdt-site.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use('/images', express.static(imagesDir), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware: JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    console.log('Token verified for user:', user);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(403).json({ 
      error: err.message, 
      code,
      details: {
        receivedToken: token,
        secretUsed: JWT_SECRET === 'Sibi1970' ? 'default-secret' : 'custom-secret'
      }
    });
  }
};

app.use('/images', express.static(imagesDir), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Upload Endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    imageUrl: `/images/${req.file.filename}`,
    message: 'Upload successful'
  });
});

// Sample departments route
app.get('/api/departments', (req, res) => {
  res.json({
    status: "success",
    data: {
      "Hero stones": {
        en: { title: "Test Hero Stones" },
        ta: { title: "சோதனை வீரக்கல்" }
      }
    }
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

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
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// News Routes
app.get('/api/news', async (req, res) => {
  try {
    const newsItems = await News.find().sort({ createdAt: -1 }).lean();
    res.json({
      status: 'success',
      count: newsItems.length,
      data: newsItems.map(item => ({
        ...item,
        id: item._id.toString()
      })),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get('/api/news/:id([0-9a-fA-F]{24})', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ error: 'News item not found' });

    res.json({
      status: 'success',
      data: {
        ...newsItem.toObject(),
        id: newsItem._id.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ error: 'Server error' });
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
    res.status(400).json({ error: 'Invalid news data' });
  }
});

app.put('/api/news/:id([a-f0-9]{24})', authenticateToken, async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNews) return res.status(404).json({ error: 'News item not found' });

    res.json({
      status: 'success',
      data: {
        ...updatedNews.toObject(),
        id: updatedNews._id.toString()
      }
    });
  } catch (error) {
    console.error('News update error:', error);
    res.status(400).json({ error: 'Invalid update data' });
  }
});

app.delete('/api/news/:id([a-f0-9]{24})', authenticateToken, async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ error: 'News item not found' });

    res.json({ status: 'success', message: 'News item deleted successfully' });
  } catch (error) {
    console.error('News deletion error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// Seed database on first run
const initializeDB = async () => {
  try {
    const count = await News.countDocuments();
    console.log(`News collection count: ${count}`);

    if (count === 0) {
      const defaultImage = 'images/bg1.jpeg';
      const imagePath = path.join(imagesDir, 'bg1.jpeg');

      const imageExists = fs.existsSync(imagePath);
      const enImage = imageExists ? defaultImage : '';
      const taImage = imageExists ? defaultImage : '';

      await News.create({
        en: {
          title: 'Ancient Pottery Unearthed in Krishnagiri',
          description: 'Archaeologists have discovered significant pottery fragments...',
          image: enImage
        },
        ta: {
          title: 'கிருஷ்ணகிரியில் பழங்கால பானைகள் கண்டுபிடிப்பு',
          description: 'சங்க காலத்தைச் சேர்ந்த குறிப்பிடத்தக்க பானை ஓடுகளை...',
          image: taImage
        }
      });

      console.log('✅ Initial news document inserted');
    }
  } catch (err) {
    console.error('DB init error:', err);
  }
};

mongoose.connection.once('open', initializeDB);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log('- GET    /api/departments');
  console.log('- POST   /api/login');
  console.log('- GET    /api/news');
  console.log('- GET    /api/news/:id');
  console.log('- POST   /api/news       (protected)');
  console.log('- PUT    /api/news/:id   (protected)');
  console.log('- DELETE /api/news/:id   (protected)');
  console.log('- POST   /api/upload     (protected)');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('✅ Server and DB connections closed');
      process.exit(0);
    });
  });
});
