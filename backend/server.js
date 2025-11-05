const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Initialize app before using it
const app = express();

// ✅ Middleware
app.use(express.json());



// ✅ CORS setup
const allowed = process.env.CORS_ORIGIN || "*"; // set this to your Netlify URL in production
const corsOptions = {
  origin: allowed === "*" ? "*" : allowed.split(",").map(url => url.trim()),
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Connect to MongoDB
const PORT = process.env.PORT || 5001;
const MONGO = process.env.MONGO_URI || 'mongodb+srv://smaryanarang01_db_user:derabassi74@cluster0.rbl8hqw.mongodb.net/eLearningDB?retryWrites=true&w=majority';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));