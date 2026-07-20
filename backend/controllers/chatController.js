const { chat, chatStream } = require('../services/aiService');
const { detectAndExecute } = require('../services/commandService');

/**
 * POST /api/chat
 * Standard non-streaming chat endpoint
 */
const handleChat = async (req, res) => {
  try {
    const { message, history = [], model, geminiApiKey, groqApiKey } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const userMessage = message.trim();

    const cmdResult = await detectAndExecute(userMessage);
    let contextMessage = userMessage;
    if (cmdResult.executed) {
      if (cmdResult.success) {
        contextMessage = `${userMessage}\n\n[SYSTEM: Command executed successfully — "${cmdResult.description}". Confirm this in your JARVIS style. Be brief.]`;
      } else {
        contextMessage = `${userMessage}\n\n[SYSTEM: Attempted to execute "${cmdResult.description}" but failed with error: ${cmdResult.error}. Apologize briefly and suggest an alternative.]`;
      }
    }

    const reply = await chat(contextMessage, history, { model, geminiApiKey, groqApiKey });
    return res.json({
      success: true,
      reply,
      commandExecuted: cmdResult.executed ? cmdResult.description : null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[ChatController] Full error:', err);
    return res.status(500).json({ error: 'JARVIS encountered an internal error.' });
  }
};

/**
 * GET /api/chat/stream
 * Streaming chat endpoint via Server-Sent Events (SSE)
 */
const handleChatStream = async (req, res) => {
  // SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    // In SSE, usually we pass data via query params or a prior POST. 
    // To keep it simple, we'll accept message and history via query params, 
    // but history might be too large for URL. 
    // Better yet: make it a POST request but stream the response.
    const { message, history = [], model, geminiApiKey, groqApiKey } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.write(`data: ${JSON.stringify({ error: 'Message is required.' })}\n\n`);
      return res.end();
    }

    const userMessage = message.trim();
    const cmdResult = await detectAndExecute(userMessage);

    let contextMessage = userMessage;
    if (cmdResult.executed) {
      if (cmdResult.success) {
        contextMessage = `${userMessage}\n\n[SYSTEM: Command executed successfully — "${cmdResult.description}". Confirm this in your JARVIS style. Be brief.]`;
      } else {
        contextMessage = `${userMessage}\n\n[SYSTEM: Attempted to execute "${cmdResult.description}" but failed with error: ${cmdResult.error}. Apologize briefly.]`;
      }
    }

    await chatStream(contextMessage, history, { model, geminiApiKey, groqApiKey }, (chunk) => {
      // Send chunk
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error('[ChatController] Stream error:', err);
    res.write(`data: ${JSON.stringify({ error: 'JARVIS stream error' })}\n\n`);
    res.end();
  }
};

module.exports = { handleChat, handleChatStream };
