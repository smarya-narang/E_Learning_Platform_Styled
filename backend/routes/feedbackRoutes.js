const express = require('express');
const Feedback = require('../models/Feedback');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { auth, isStudent } = require('../middleware/auth');
const router = express.Router();

// Get feedback for a quiz attempt (Student)
router.get('/attempt/:attemptId', auth, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ msg: 'Attempt not found' });
    
    // Check if user owns this attempt
    if (attempt.user.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const quiz = await Quiz.findById(attempt.quiz);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    
    const totalScore = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const percentage = Math.round((attempt.score / totalScore) * 100);
    
    // Get correct answers
    const correctAnswers = quiz.questions.map(q => q.correctIndex);
    
    // Generate feedback
    let feedbackText = '';
    if (percentage >= 90) feedbackText = 'Excellent work! You have mastered this topic.';
    else if (percentage >= 70) feedbackText = 'Good job! You have a solid understanding.';
    else if (percentage >= 50) feedbackText = 'Not bad, but there is room for improvement.';
    else feedbackText = 'Keep practicing! Review the material and try again.';
    
    // Check if feedback already exists
    let feedback = await Feedback.findOne({ attempt: req.params.attemptId });
    if (!feedback) {
      feedback = new Feedback({
        user: attempt.user,
        quiz: attempt.quiz,
        attempt: req.params.attemptId,
        score: attempt.score,
        totalScore,
        percentage,
        feedback: feedbackText,
        correctAnswers,
        studentAnswers: attempt.answers
      });
      await feedback.save();
    }
    
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all feedbacks for a user (Student)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user is requesting their own feedbacks or is admin
    if (req.user.id !== req.params.userId && req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const feedbacks = await Feedback.find({ user: req.params.userId })
      .populate('quiz', 'title')
      .populate('attempt', 'score createdAt')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get feedbacks for a quiz (Faculty/Admin)
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Faculty') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const feedbacks = await Feedback.find({ quiz: req.params.quizId })
      .populate('user', 'name email')
      .populate('attempt', 'score createdAt')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

