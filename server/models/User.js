const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  photos: { type: [String], default: [] },
  followers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  following: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  friends: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
});

// Şifre kaydetmeden önce hashle
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 