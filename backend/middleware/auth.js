const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is Faculty
const isFaculty = (req, res, next) => {
  if (req.user.role !== 'Faculty') {
    return res.status(403).json({ msg: 'Access denied. Faculty only.' });
  }
  next();
};

// Middleware to check if user is Student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'Student') {
    return res.status(403).json({ msg: 'Access denied. Student only.' });
  }
  next();
};

module.exports = { auth, isAdmin, isFaculty, isStudent };

