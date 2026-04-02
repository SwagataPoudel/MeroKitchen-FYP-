const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: String,       // "userId1_userId2" sorted
  senderId: String,
  senderRole: String,   // "customer" or "seller"
  text: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);