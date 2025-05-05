// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../backend/Models/User.js";

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this to auth.js as another route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'User already exists' });
  
      const hashed = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashed });
      await newUser.save();
  
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

export default router;
