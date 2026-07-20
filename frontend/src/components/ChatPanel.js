import React, { useEffect, useRef } from 'react';
import './ChatPanel.css';

const TypingIndicator = () => (
  <div className="chat-msg chat-msg--jarvis">
    <div className="chat-msg__avatar">
      <div className="chat-msg__avatar-orb" />
    </div>
    <div className="chat-msg__bubble chat-msg__bubble--jarvis">
      <div className="chat-typing">
        <span className="chat-typing__dot" style={{ animationDelay: '0ms' }} />
        <span className="chat-typing__dot" style={{ animationDelay: '160ms' }} />
        <span className="chat-typing__dot" style={{ animationDelay: '320ms' }} />
      </div>
    </div>
  </div>
);

const Message = ({ msg }) => {
  const isJarvis = msg.role === 'jarvis';
  const time = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '';

  return (
    <div className={`chat-msg chat-msg--${isJarvis ? 'jarvis' : 'user'}`}>
      {isJarvis && (
        <div className="chat-msg__avatar">
          <div className="chat-msg__avatar-orb" />
        </div>
      )}
      <div className="chat-msg__content">
        <div className={`chat-msg__bubble chat-msg__bubble--${isJarvis ? 'jarvis' : 'user'}`}>
          <p className="chat-msg__text">{msg.content}</p>
        </div>
        <span className="chat-msg__time">{time}</span>
      </div>
      {!isJarvis && (
        <div className="chat-msg__avatar chat-msg__avatar--user">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const ChatPanel = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <span className="chat-panel__header-label font-hud">CONVERSATION LOG</span>
        <span className="chat-panel__header-count">{messages.length} MSG</span>
      </div>

      <div className="chat-panel__feed">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatPanel;
