const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: String,       
  senderId: String,
  senderRole: String,  
  text: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);