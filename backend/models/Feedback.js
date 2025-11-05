const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  attempt: { type: mongoose.Schema.Types.ObjectId, ref: 'Attempt', required: true },
  score: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  feedback: { type: String },
  correctAnswers: [Number],
  studentAnswers: [Number],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

