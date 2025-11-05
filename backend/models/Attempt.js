const mongoose = require('mongoose');
const AttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [Number], // indices of chosen options
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Attempt', AttemptSchema);
