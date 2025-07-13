const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  photos: { type: [String], required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String },
  username: { type: String }
});

module.exports = mongoose.model('Box', BoxSchema); 