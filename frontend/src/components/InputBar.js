import React, { useState, useRef, useEffect } from 'react';
import VoiceButton from './VoiceButton';
import './InputBar.css';

const InputBar = ({ onSend, onVoiceToggle, isListening, transcript }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // When transcript changes (from voice), fill input
  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript]);

  const wasListening = useRef(isListening);

  // Auto-send when voice stops listening (either from silence or manual stop)
  useEffect(() => {
    if (wasListening.current && !isListening) {
      const trimmed = text.trim();
      if (trimmed) {
        onSend(trimmed);
        setText('');
      }
    }
    wasListening.current = isListening;
  }, [isListening, text, onSend]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-bar glass">
      <div className="input-bar__inner">
        {/* Prefix label */}
        <span className="input-bar__prefix font-hud">{'>'}</span>

        {/* Text area */}
        <textarea
          ref={inputRef}
          className="input-bar__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak or type your command..."
          rows={1}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Voice button */}
        <VoiceButton isListening={isListening} onClick={onVoiceToggle} />

        {/* Send button */}
        <button
          className={`input-bar__send ${text.trim() ? 'input-bar__send--active' : ''}`}
          onClick={handleSend}
          title="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className="input-bar__hint">
        <span>ENTER to send</span>
        <span className="input-bar__hint-sep">·</span>
        <span>SHIFT+ENTER for newline</span>
      </div>
    </div>
  );
};

export default InputBar;
