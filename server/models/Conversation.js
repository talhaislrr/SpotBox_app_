const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // user IDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conversation', ConversationSchema); 