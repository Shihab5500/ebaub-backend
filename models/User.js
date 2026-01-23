const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  varsityId: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  photoURL: { type: String }, // Profile Pic
  idCardImage: { type: String, required: true }, // ✅ New: ID Card Pic
  uid: { type: String, required: true },
  role: { type: String, default: 'user' }, // user, moderator, admin
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // ✅ New: Status
  suspensionEndsAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);