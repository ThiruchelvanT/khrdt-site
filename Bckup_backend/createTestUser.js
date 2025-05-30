import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';  // Note the .js extension
import 'dotenv/config';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");

  const email = 'test@example.com';
  const password = 'password123';

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
    } else {
      const newUser = new User({ email, password });
      await newUser.save();
      console.log('Test user created:', newUser.email);
    }
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    mongoose.disconnect();
  }
});