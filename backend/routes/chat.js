const express = require('express');
const router = express.Router();
const { handleChat, handleChatStream } = require('../controllers/chatController');
const { getSystemInfo } = require('../services/commandService');

// POST /api/chat
router.post('/chat', handleChat);

// POST /api/chat/stream
router.post('/chat/stream', handleChatStream);

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'JARVIS Backend',
    version: '3.1.0',
    ai: 'Groq (llama-3.3-70b-versatile)',
    timestamp: new Date().toISOString(),
    apiKeySet: !!process.env.GROQ_API_KEY,
  });
});

// GET /api/system — real-time system info
router.get('/system', async (req, res) => {
  try {
    const info = await getSystemInfo();
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve system info' });
  }
});

module.exports = router;
