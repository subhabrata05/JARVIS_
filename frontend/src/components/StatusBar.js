import React, { useEffect, useState } from 'react';
import './StatusBar.css';

const StatusBar = ({ isThinking, isListening }) => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('jarvis_theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('jarvis_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

  const formatUptime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const getStatus = () => {
    if (isListening) return { label: 'LISTENING', color: 'var(--green)' };
    if (isThinking) return { label: 'PROCESSING', color: 'var(--amber)' };
    return { label: 'ONLINE', color: 'var(--green)' };
  };

  const status = getStatus();

  return (
    <header className="status-bar glass">
      <div className="status-bar__left">
        <div className="status-bar__logo font-hud">
          <span className="status-bar__logo-j">J</span>ARVIS
        </div>
        <div className="status-bar__version">v3.1.0</div>
      </div>

      <div className="status-bar__center">
        <div className="status-bar__time font-hud">{formatTime(time)}</div>
        <div className="status-bar__date">{formatDate(time)}</div>
      </div>

      <div className="status-bar__right">
        <button className="status-bar__theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <div className="status-bar__divider" />
        <div className="status-bar__metric">
          <span className="status-bar__metric-label">UPTIME</span>
          <span className="status-bar__metric-value font-hud">{formatUptime(uptime)}</span>
        </div>
        <div className="status-bar__divider" />
        <div className="status-bar__status" style={{ color: status.color }}>
          <span className="status-bar__status-dot" style={{ background: status.color }} />
          <span className="font-hud status-bar__status-label">{status.label}</span>
        </div>
      </div>

      {/* Animated scan line */}
      <div className="status-bar__scanline" />
    </header>
  );
};

export default StatusBar;
