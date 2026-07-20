const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ollamaService = require('./ollamaService');

const SYSTEM_PROMPT = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), a highly intelligent AI assistant with full control over the user's Windows laptop.

Your personality:
- You are calm, precise, and highly intelligent
- You speak formally but with warmth — like a trusted advisor
- You address the user as "sir" or "ma'am"
- You are direct, concise, and helpful
- You have a subtle, dry British wit

Your capabilities (already integrated into the backend):
- Opening applications: camera, notepad, calculator, paint, task manager, settings, file explorer, VS Code, Spotify, Chrome, Edge, Firefox, Word, Excel, PowerPoint
- Opening websites: YouTube, Google, Gmail, GitHub, WhatsApp, Netflix, Instagram, Twitter, ChatGPT
- Opening folders: downloads, desktop, documents, pictures
- Volume control: volume up/down, mute
- Power: lock screen, sleep, restart, shutdown, cancel shutdown
- Screenshot capture
- Real-time system info: battery, CPU, memory, hostname

When the system tells you a command was executed (via [SYSTEM: ...] tag), acknowledge it naturally and briefly in JARVIS style. Do NOT explain how to do it manually — you already did it.

Keep all responses concise. For system actions, a single confident sentence is enough (e.g., "Camera is now active, sir." or "YouTube is open and awaiting your selection.").`;

/**
 * Send a message and get a JARVIS response.
 */
const chat = async (message, history = [], options = {}) => {
  const { model = 'llama-3.3-70b-versatile', geminiApiKey, groqApiKey } = options;

  try {
    if (model.startsWith('gemini')) {
    const key = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API key is required for Gemini models.');
    
    const genAI = new GoogleGenerativeAI(key);
    const geminiModel = genAI.getGenerativeModel({
      model: model,
      systemInstruction: SYSTEM_PROMPT,
    });

    const geminiHistory = history.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' || m.role === 'jarvis' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chatSession = geminiModel.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 1024,
      }
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } else {
    // Groq
    const key = groqApiKey || process.env.GROQ_API_KEY;
    if (!key) throw new Error('Groq API key is required for Groq models.');
    
    const groqClient = new Groq({ apiKey: key });
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === 'jarvis' || m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groqClient.chat.completions.create({
      model: model,
      messages,
      temperature: 0.85,
      max_tokens: 1024,
      top_p: 0.95,
    });

      return completion.choices[0]?.message?.content || 'I was unable to generate a response.';
    }
  } catch (error) {
    console.log('[AI] Cloud API failed or offline. Falling back to Ollama...', error.message);
    if (await ollamaService.isOllamaAvailable()) {
      return await ollamaService.chat(message, history, SYSTEM_PROMPT);
    }
    throw error;
  }
};

/**
 * Stream a message and get JARVIS response chunks.
 */
const chatStream = async (message, history = [], options = {}, onChunk) => {
  const { model = 'llama-3.3-70b-versatile', geminiApiKey, groqApiKey } = options;

  try {
    if (model.startsWith('gemini')) {
    const key = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API key is required for Gemini models.');
    
    const genAI = new GoogleGenerativeAI(key);
    const geminiModel = genAI.getGenerativeModel({
      model: model,
      systemInstruction: SYSTEM_PROMPT,
    });

    const geminiHistory = history.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' || m.role === 'jarvis' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chatSession = geminiModel.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 1024,
      }
    });

    const result = await chatSession.sendMessageStream(message);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } else {
    // Groq Stream
    const key = groqApiKey || process.env.GROQ_API_KEY;
    if (!key) throw new Error('Groq API key is required for Groq models.');
    
    const groqClient = new Groq({ apiKey: key });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === 'jarvis' || m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const stream = await groqClient.chat.completions.create({
      model: model,
      messages,
      temperature: 0.85,
      max_tokens: 1024,
      top_p: 0.95,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  }
} catch (error) {
  console.log('[AI] Cloud API failed or offline (stream). Falling back to Ollama...', error.message);
    if (await ollamaService.isOllamaAvailable()) {
      return await ollamaService.chatStream(message, history, SYSTEM_PROMPT, onChunk);
    }
    throw error;
  }
};

module.exports = { chat, chatStream };
