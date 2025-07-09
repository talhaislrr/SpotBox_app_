require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const Box = require('./models/Box');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');
const boxesUploadRoutes = require('./routes/boxes');
const chatRoutes = require('./routes/chat');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Statik uploads klasörünü servis et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Box fotoğraf ve verilerini yükle
app.use('/api/boxes-upload', boxesUploadRoutes);
app.use('/api/chats', chatRoutes);

// Auth rotaları
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => res.send('SpotBox API Running'));

// Get all boxes
app.get('/api/boxes', auth, async (req, res) => {
  try {
    const boxes = await Box.find().sort({ timestamp: -1 });
    res.json(boxes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new box
app.post('/api/boxes', auth, async (req, res) => {
  try {
    const { location, photos, timestamp, userId, username } = req.body;
    if (!location || !photos) {
      return res.status(400).json({ message: 'location and photos are required' });
    }
    const box = new Box({ location, photos, timestamp, userId, username });
    await box.save();
    res.status(201).json(box);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE all boxes
app.delete('/api/boxes', auth, async (req, res) => {
  try {
    await Box.deleteMany({});
    res.json({ message: 'All boxes deleted' });
  } catch (error) {
    console.error('Delete all boxes error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} kullanımda, lütfen başka bir port deneyin veya çakışan süreci kapatın.`);
    process.exit(1);
  }
}); 