const express = require('express');
const Material = require('../models/Material');
const { auth, isFaculty } = require('../middleware/auth');
const router = express.Router();

// Upload material (Faculty only)
router.post('/', auth, isFaculty, async (req, res) => {
  try {
    const { title, description, course, fileUrl, fileType } = req.body;
    if (!title || !course) {
      return res.status(400).json({ msg: 'Title and course are required' });
    }
    const material = new Material({
      title,
      description,
      course,
      faculty: req.user.id,
      fileUrl,
      fileType: fileType || 'other'
    });
    await material.save();
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get materials for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId })
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all materials
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('course', 'title')
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete material (Faculty only)
router.delete('/:id', auth, isFaculty, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }
    if (material.faculty.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this material' });
    }
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

