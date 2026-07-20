import { useState, useCallback } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'jarvis',
    content: "Good day. I am J.A.R.V.I.S. — Just A Rather Very Intelligent System. All systems are online and operational. How may I assist you today?",
    timestamp: new Date(),
  },
];

const useChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading) return null;

      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const jarvisMsgId = Date.now() + 1;
      let fullResponse = '';

      // Add a placeholder message for JARVIS that we will stream into
      setMessages((prev) => [
        ...prev,
        {
          id: jarvisMsgId,
          role: 'jarvis',
          content: '',
          timestamp: new Date(),
        },
      ]);

      try {
        const response = await fetch(`${BACKEND_URL}/api/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            history: messages.slice(-10).map((m) => ({
              role: m.role === 'jarvis' ? 'model' : 'user',
              content: m.content,
            })),
            model: localStorage.getItem('jarvis_model') || 'llama-3.3-70b-versatile',
            geminiApiKey: localStorage.getItem('jarvis_api_key') || '',
            groqApiKey: localStorage.getItem('jarvis_groq_api_key') || '',
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === jarvisMsgId
                ? { ...m, content: `⚠️ ${errData.error || 'An unknown error occurred.'}`, isError: true }
                : m
            )
          );
          return null;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  fullResponse += `\n[Error: ${parsed.error}]`;
                } else if (parsed.chunk) {
                  fullResponse += parsed.chunk;
                  // Capture current state of fullResponse for the state update
                  const currentResponse = fullResponse;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === jarvisMsgId ? { ...m, content: currentResponse } : m))
                  );
                }
              } catch (e) {
                // Ignore parse errors from incomplete chunks
              }
            }
          }
        }

        return fullResponse;
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === jarvisMsgId
              ? {
                  ...m,
                  content: '⚠️ Cannot reach backend server. Please make sure it is running:\n  cd backend && npm start',
                  isError: true,
                }
              : m
          )
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        role: 'jarvis',
        content: 'Conversation log cleared. Ready for new instructions.',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
};

export default useChat;
