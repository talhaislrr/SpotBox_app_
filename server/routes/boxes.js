// server/routes/boxes.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const Box = require('../models/Box');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// Fotoğraf ile birlikte kutu bilgilerini yükle
router.post('/', auth, upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const files = req.files;
    if (!files.front || !files.back) {
      return res.status(400).json({ message: 'Ön ve arka fotoğraf gerekli' });
    }
    const frontFile = files.front[0];
    const backFile = files.back[0];
    const host = `${req.protocol}://${req.get('host')}`;
    const photos = [
      `${host}/uploads/${frontFile.filename}`,
      `${host}/uploads/${backFile.filename}`
    ];
    const box = new Box({
      location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      photos,
      userId: req.user.id,
      username: req.user.email
    });
    await box.save();
    res.status(201).json(box);
  } catch (error) {
    console.error('Box upload hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 