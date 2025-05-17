import express from 'express';

const app = express();
const PORT = 5052; // Use a different port

app.get('/test', (req, res) => {
  res.json({ message: 'Hello from simple Express!' });
});

app.listen(PORT, () => {
  console.log(`Simple Express server running on http://localhost:${PORT}`);
});