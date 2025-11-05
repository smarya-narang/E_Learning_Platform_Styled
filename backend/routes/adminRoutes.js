const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get user by ID (Admin only)
router.get('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update user (Admin only)
router.put('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, role, points, badges } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (points !== undefined) user.points = points;
    if (badges) user.badges = badges;
    
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, points: user.points, badges: user.badges });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete user (Admin only)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all courses (Admin only)
router.get('/courses', auth, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email').sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete course (Admin only)
router.delete('/courses/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update course (Admin only)
router.put('/courses/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, faculty } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    if (title) course.title = title;
    if (description !== undefined) course.description = description;
    if (faculty) course.faculty = faculty;
    
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

