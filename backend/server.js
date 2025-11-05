const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ---------- Middleware ----------
app.use(express.json());

// ---------- CORS (safe + flexible) ----------
const rawOrigins =
  process.env.CORS_ORIGIN ||
  'http://localhost:5173,https://classy-crostata-0ffe57.netlify.app';

const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim().replace(/\/+$/, '')) // trim spaces + remove trailing slash
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser tools (no Origin), e.g. curl/Postman/health checks
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true
}));

// ---------- Health + root ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// optional: keep plain /health too
app.get('/health', (req, res) => res.json({ ok: true }));

// root message (since frontend is on Netlify)
app.get('/', (req, res) => {
  res.send('API is running. Use /api/... endpoints. Health: /api/health');
});

// ---------- Routes ----------
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// ---------- DB + Server ----------
const PORT = process.env.PORT || 5001;
const MONGO =
  process.env.MONGO_URI ||
  'mongodb+srv://<username>:<password>@cluster0.rbl8hqw.mongodb.net/eLearningDB?retryWrites=true&w=majority';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));