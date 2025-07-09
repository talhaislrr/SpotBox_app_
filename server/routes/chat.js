const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const router = express.Router();

// Konuşma oluştur veya var olanı döndür
router.post('/', auth, async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user.id;
  try {
    let conv = await Conversation.findOne({ participants: { $all: [userId, participantId] } });
    if (!conv) {
      conv = new Conversation({ participants: [userId, participantId] });
      await conv.save();
    }
    res.json(conv);
  } catch (error) {
    console.error('Conversation oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Kullanıcının konuşmalarını listele
router.get('/', auth, async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.user.id });
    res.json(convs);
  } catch (error) {
    console.error('Konuşma listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Bir konuşmadaki mesajları getir
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const msgs = await Message.find({ conversationId: req.params.id }).sort({ timestamp: 1 });
    res.json(msgs);
  } catch (error) {
    console.error('Mesaj listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Bir konuşmaya mesaj ekle
router.post('/:id/messages', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const msg = new Message({ conversationId: req.params.id, senderId: req.user.id, text });
    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 