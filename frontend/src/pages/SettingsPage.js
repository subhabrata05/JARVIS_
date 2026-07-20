import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatusBar from '../components/StatusBar';
import './SettingsPage.css';

const Toggle = ({ value, onChange }) => (
  <button
    className={`settings-toggle ${value ? 'settings-toggle--on' : ''}`}
    onClick={() => onChange(!value)}
  >
    <span className="settings-toggle__thumb" />
  </button>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem('jarvis_voice') !== 'false');
  const [model, setModel] = useState(localStorage.getItem('jarvis_model') || 'llama-3.3-70b-versatile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('jarvis_voice', voiceEnabled);
    localStorage.setItem('jarvis_model', model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <StatusBar />
      <div className="settings-page__body">
        <Sidebar />
        <main className="settings-main">
          <div className="settings-main__inner">
            {/* Header */}
            <div className="settings-header">
              <button className="settings-back" onClick={() => navigate('/')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                BACK
              </button>
              <div>
                <h1 className="settings-header__title font-hud">SYSTEM CONFIGURATION</h1>
                <p className="settings-header__sub">Manage JARVIS core settings</p>
              </div>
            </div>

            {/* Cards */}
            <div className="settings-cards">

              {/* API Config */}
              <div className="settings-card glass">
                <div className="settings-card__header">
                  <div className="settings-card__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="settings-card__title font-hud">AI CORE</h2>
                    <p className="settings-card__desc">Configure AI model and API credentials</p>
                  </div>
                </div>

                <div className="settings-field">
                  <label className="settings-field__label font-hud">AI MODEL</label>
                  <div className="settings-select-wrap">
                    <select className="settings-select" value={model} onChange={(e) => setModel(e.target.value)}>
                      <optgroup label="Groq (Lightning Fast)">
                        <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Best Overall)</option>
                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (Fastest)</option>
                        <option value="mixtral-8x7b-32768">Mixtral 8x7B (Complex Reasoning)</option>
                        <option value="gemma2-9b-it">Gemma 2 9B (Efficient)</option>
                      </optgroup>
                      <optgroup label="Google (Advanced Context)">
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Analysis)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="settings-field" style={{ marginTop: '24px' }}>
                  <label className="settings-field__label font-hud">SYSTEM RESOURCE ALLOCATION</label>
                  <div className="settings-about" style={{ marginTop: '12px', background: 'var(--glass-light)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div className="settings-about__row">
                      <span className="font-hud settings-about__key">AVAILABLE TOKENS</span>
                      <span className="settings-about__val" style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: '600', textShadow: '0 0 10px var(--cyan-glow)' }}>
                        4,992,104
                      </span>
                    </div>
                    <div className="settings-about__row">
                      <span className="font-hud settings-about__key">USAGE LIMIT</span>
                      <span className="settings-about__val" style={{ opacity: 0.8 }}>5,000,000 / month</span>
                    </div>
                  </div>
                  <p className="settings-field__hint">Tokens are shared across all available AI models.</p>
                </div>
              </div>

              {/* Voice Config */}
              <div className="settings-card glass">
                <div className="settings-card__header">
                  <div className="settings-card__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="settings-card__title font-hud">VOICE MODULE</h2>
                    <p className="settings-card__desc">Speech recognition and synthesis settings</p>
                  </div>
                </div>

                <div className="settings-field settings-field--row">
                  <div>
                    <label className="settings-field__label font-hud">TEXT-TO-SPEECH</label>
                    <p className="settings-field__hint">JARVIS speaks responses aloud</p>
                  </div>
                  <Toggle value={voiceEnabled} onChange={setVoiceEnabled} />
                </div>
              </div>

              {/* About */}
              <div className="settings-card glass">
                <div className="settings-card__header">
                  <div className="settings-card__icon settings-card__icon--purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="settings-card__title font-hud">ABOUT JARVIS</h2>
                    <p className="settings-card__desc">System information</p>
                  </div>
                </div>
                <div className="settings-about">
                  <div className="settings-about__row">
                    <span className="font-hud settings-about__key">VERSION</span>
                    <span className="settings-about__val">v3.1.0</span>
                  </div>
                  <div className="settings-about__row">
                    <span className="font-hud settings-about__key">STACK</span>
                    <span className="settings-about__val">React · Node.js · Gemini AI</span>
                  </div>
                  <div className="settings-about__row">
                    <span className="font-hud settings-about__key">STATUS</span>
                    <span className="settings-about__val" style={{ color: 'var(--green)' }}>OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="settings-actions">
              <button className={`settings-save-btn font-hud ${saved ? 'settings-save-btn--saved' : ''}`} onClick={handleSave}>
                {saved ? '✓ SAVED' : 'SAVE CONFIGURATION'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
