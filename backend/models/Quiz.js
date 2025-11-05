const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number,
  points: { type: Number, default: 10 }
});
const QuizSchema = new mongoose.Schema({
  title: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Quiz', QuizSchema);
