require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'JARVIS Backend API',
    version: '3.1.0',
    status: 'online',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   J.A.R.V.I.S. Backend - Online      ║');
  console.log(`  ║   Port: ${PORT}                          ║`);
  console.log(`  ║   AI:   Groq (llama-3.3-70b)          ║`);
  console.log(`  ║   Key:  ${process.env.GROQ_API_KEY ? '✓ Set' : '✗ Missing — add GROQ_API_KEY to .env'}  ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
