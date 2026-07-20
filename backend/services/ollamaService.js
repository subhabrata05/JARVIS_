/**
 * ollamaService.js
 * Talks to a locally running Ollama server (http://localhost:11434).
 * Works 100% offline once the model is downloaded.
 *
 * Setup (one-time):
 *   1. Download Ollama: https://ollama.com/download/windows
 *   2. Run: ollama pull mistral
 *   3. Ollama will auto-start on every boot.
 */

const OLLAMA_BASE = 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Check if Ollama is running locally.
 * Returns true/false without throwing.
 */
const isOllamaAvailable = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Send a message to Ollama and get a complete response.
 */
const chat = async (message, history = [], systemPrompt = '') => {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === 'jarvis' || m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.85, num_predict: 512 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.message?.content || 'No response from local model.';
};

/**
 * Stream a message to Ollama, calling onChunk for each piece.
 */
const chatStream = async (message, history = [], systemPrompt = '', onChunk) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === 'jarvis' || m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: true,
      options: { temperature: 0.85, num_predict: 512 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value, { stream: true }).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        const content = obj.message?.content;
        if (content) onChunk(content);
      } catch {}
    }
  }
};

module.exports = { isOllamaAvailable, chat, chatStream };
