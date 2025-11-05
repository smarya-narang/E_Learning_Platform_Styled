const express = require('express');
const Course = require('../models/Course');
const { auth, isFaculty } = require('../middleware/auth');
const router = express.Router();

// Create course (Faculty)
router.post('/', auth, isFaculty, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });
    const course = new Course({ title, description, faculty: req.user.id });
    await course.save();
    await course.populate('faculty', 'name email');
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty','name email');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
