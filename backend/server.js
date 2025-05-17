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
const PORT = process.env.PORT || 5050


const JWT_SECRET = process.env.JWT_SECRET || 'Sibi1970';

const corsOptions = {
  origin: 'http://localhost:5176',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.get('/api/departments', (req, res) => {
  console.log('Departments request from:', req.ip);
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

app.post('/api/login', express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/testuser', async (req, res) => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  await user.save();
  res.json(user);
});

app.get('/api/news', async (req, res) => {
  console.log('Request received at /api/news');
  try {
    const newsItems = await News.find();
    console.log('News items fetched (before sending):', newsItems);
    res.json({ status: 'success', newsItems });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const newNews = new News(req.body);
    const savedNews = await newNews.save();
    res.status(201).json({
      status: 'success',
      newsItem: {
        ...savedNews.toObject(),
        id: savedNews._id.toString()
      }
    });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ error: 'Failed to add news' });
  }
});

app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json({ status: 'success', newsItem: updatedNews });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json({ status: 'success', message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

mongoose.connection.once('open', async () => {
  try {
    const count = await News.countDocuments();
    console.log(`News collection contains ${count} documents`);

    if (count === 0) {
      const testNews = new News({
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
      await testNews.save();
      console.log('Added test news item');
    }
  } catch (err) {
    console.error('Error during setup:', err);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`- http://localhost:${PORT}/api/health`);
  console.log(`- http://localhost:${PORT}/api/departments`);
  console.log(`- http://localhost:${PORT}/api/news (GET - public)`);
  console.log(`- http://localhost:${PORT}/api/news (POST - protected)`);
  console.log(`- http://localhost:${PORT}/api/news/:id (PUT - protected)`);
  console.log(`- http://localhost:${PORT}/api/news/:id (DELETE - protected)`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
