// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());

// ---------------- CORS (safe + flexible) ----------------
// Static allowlist: local dev + your main Netlify site (no trailing slashes)
const STATIC_ALLOWED = [
  'http://localhost:5173',
  'https://classy-crostata-0ffe57.netlify.app',
];

// Helper: allow Netlify deploy previews like
// https://<hash>--classy-crostata-0ffe57.netlify.app
function isNetlifyPreview(host) {
  return /^[a-z0-9-]+--classy-crostata-0ffe57\.netlify\.app$/i.test(host);
}

function isAllowedOrigin(origin) {
  if (!origin) return true; // allow curl/Postman/Render health checks (no Origin)
  const clean = origin.replace(/\/+$/, '');
  if (STATIC_ALLOWED.includes(clean)) return true;

  try {
    const url = new URL(clean);
    if (isNetlifyPreview(url.host)) return true;
  } catch (_) {
    // ignore parse errors, treat as not allowed
  }
  return false;
}

app.use(cors({
  origin(origin, cb) {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin || 'no-origin'}`));
  },
  credentials: true,
}));

// Make sure OPTIONS preflight succeeds everywhere
app.options('*', cors());

// Optional: friendlier JSON when CORS blocks (instead of crashing)
app.use((err, req, res, next) => {
  if (err && typeof err.message === 'string' && err.message.startsWith('Not allowed by CORS')) {
    return res.status(403).json({ message: 'CORS blocked: origin not allowed', origin: req.headers.origin || null });
  }
  return next(err);
});

// ---------------- Health + Root ----------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Optional plain health (used by you earlier)
app.get('/health', (req, res) => res.json({ ok: true }));

// Root message (frontend is on Netlify)
app.get('/', (req, res) => {
  res.send('API is running. Use /api/... endpoints. Health: /api/health');
});

// ---------------- Routes ----------------
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Mount under /api
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// ---------------- DB + Server ----------------
const PORT = process.env.PORT || 5001;
const MONGO = process.env.MONGO_URI; // keep credentials in env only

if (!MONGO) {
  console.error('❌ Missing MONGO_URI env variable');
  process.exit(1);
}

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });