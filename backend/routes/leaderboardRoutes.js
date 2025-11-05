const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Top N leaderboard
router.get('/top/:n', async (req, res) => {
  try {
    const n = parseInt(req.params.n) || 10;
    const top = await User.find().sort({ points: -1 }).limit(n).select('name points badges');
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
