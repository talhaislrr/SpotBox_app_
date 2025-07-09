const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Added auth middleware

const router = express.Router();

// Kayıt (Register)
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Zaten kullanıcı var mı?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }
    // Yeni kullanıcı oluştur
    const user = new User({ email, username, password });
    await user.save();
    // JWT oluştur
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Giriş (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-posta veya şifre yanlış.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Mevcut kullanıcı bilgilerini dönen endpoint
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json({ id: user._id, email: user.email, username: user.username, createdAt: user.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 