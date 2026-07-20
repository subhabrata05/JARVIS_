import React from 'react';
import './VoiceButton.css';

const VoiceButton = ({ isListening, onClick }) => {
  return (
    <button
      className={`voice-btn ${isListening ? 'voice-btn--active' : ''}`}
      onClick={onClick}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {/* Mic icon */}
      <svg className="voice-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>

      {/* Waveform bars (shown when listening) */}
      {isListening && (
        <div className="voice-btn__wave">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="voice-btn__wave-bar"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}

      {/* Ripple ring */}
      {isListening && <span className="voice-btn__ripple" />}
    </button>
  );
};

export default VoiceButton;
