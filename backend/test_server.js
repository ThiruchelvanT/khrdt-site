// import express from 'express';
// import cors from 'cors';

// const app = express();
// const PORT = 5051; // Use a different port to avoid conflicts

// const corsOptions = {
//   origin: 'http://localhost:5175',
//   methods: ['GET'],
//   allowedHeaders: ['Content-Type']
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// app.get('/api/news', (req, res) => {
//   console.log('Test /api/news route hit!');
//   const newsData = { status: 'success', message: 'This is test news data.' };
//   res.json(newsData);
// });

// app.listen(PORT, () => {
//   console.log(`Test server running on http://localhost:${PORT}`);
// });

import bcrypt from 'bcryptjs';
const saltRounds = 10;

// Replace 'yourpassword' with the actual password you want to use
bcrypt.hash('Thamil4301', saltRounds)
  .then(hash => {
    console.log('Hashed password:', hash);
  });
