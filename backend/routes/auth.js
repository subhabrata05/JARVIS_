const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'jarvis-admin';

  if (password === adminPassword) {
    res.json({ success: true, token: 'authenticated' });
  } else {
    res.status(401).json({ success: false, error: 'Access Denied' });
  }
});

module.exports = router;
