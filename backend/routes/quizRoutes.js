const express = require('express');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const { auth, isFaculty } = require('../middleware/auth');
const router = express.Router();

// Create quiz (Faculty)
router.post('/', auth, isFaculty, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    await quiz.populate('course', 'title');
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('course','title');
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get quiz by id
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if(!quiz) return res.status(404).json({msg:'Not found'});
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Submit attempt
router.post('/:id/attempt', auth, async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // answers = array of indices
    const userId = req.user.id;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ msg: 'Answers array is required' });
    }
    
    const quiz = await Quiz.findById(quizId);
    if(!quiz) return res.status(404).json({msg:'Quiz not found'});

    // calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if(answers[idx] === q.correctIndex) score += (q.points || 10);
    });

    const attempt = new Attempt({ user: userId, quiz: quizId, answers, score });
    await attempt.save();

    // update user points
    const user = await User.findById(userId);
    if(user) {
      user.points = (user.points || 0) + score;
      // award badges based on points
      if(user.points >= 100 && !user.badges.includes('Quiz Champion')) user.badges.push('Quiz Champion');
      else if(user.points >= 50 && !user.badges.includes('Quiz Master')) user.badges.push('Quiz Master');
      else if(user.points >= 25 && !user.badges.includes('Quiz Explorer')) user.badges.push('Quiz Explorer');
      await user.save();
    }

    res.json({ 
      attempt, 
      attemptId: attempt._id,
      newPoints: user ? user.points : null, 
      badges: user ? user.badges : [] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
