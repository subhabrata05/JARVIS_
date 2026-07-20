import React, { useCallback } from 'react';
import StatusBar from '../components/StatusBar';
import Sidebar from '../components/Sidebar';
import HUDOrb from '../components/HUDOrb';
import ChatPanel from '../components/ChatPanel';
import InputBar from '../components/InputBar';
import useChat from '../hooks/useChat';
import useSpeech from '../hooks/useSpeech';
import useSystemInfo from '../hooks/useSystemInfo';
import './MainDashboard.css';

const MainDashboard = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { isListening, transcript, toggleListening, speak } = useSpeech();
  const { sysInfo } = useSystemInfo();

  const handleSend = useCallback(
    async (text) => {
      const reply = await sendMessage(text);
      if (reply) speak(reply);
    },
    [sendMessage, speak]
  );

  const orbState = isListening ? 'listening' : isLoading ? 'thinking' : 'idle';

  return (
    <div className="dashboard">
      {/* Top status bar */}
      <StatusBar isThinking={isLoading} isListening={isListening} />

      <div className="dashboard__body">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="dashboard__main">
          {/* Left panel: Stats */}
          <section className="dashboard__left-panel">
            <div className="dashboard__panel-header">
              <span className="font-hud dashboard__panel-title">SYSTEM STATUS</span>
            </div>

            <div className="dashboard__stats">
              <div className="dashboard__stat">
                <div className="dashboard__stat-header">
                  <span className="dashboard__stat-label font-hud">BATTERY</span>
                  <span className="dashboard__stat-value" style={{ color: sysInfo?.batteryLevel < 20 ? 'var(--red)' : sysInfo?.batteryLevel < 50 ? 'var(--amber)' : 'var(--green)' }}>
                    {sysInfo?.battery || '—'}
                  </span>
                </div>
                <div className="dashboard__stat-bar">
                  <div 
                    className="dashboard__stat-fill" 
                    data-level={sysInfo?.batteryLevel < 20 ? 'danger' : sysInfo?.batteryLevel < 50 ? 'warning' : 'normal'}
                    style={{ width: sysInfo?.batteryLevel ? `${sysInfo.batteryLevel}%` : '0%' }} 
                  />
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__stat-header">
                  <span className="dashboard__stat-label font-hud">CPU LOAD</span>
                  <span className="dashboard__stat-value" style={{ color: sysInfo?.cpuLevel > 80 ? 'var(--red)' : sysInfo?.cpuLevel > 50 ? 'var(--amber)' : 'var(--text-primary)' }}>
                    {sysInfo?.cpu || '—'}
                  </span>
                </div>
                <div className="dashboard__stat-bar">
                  <div 
                    className="dashboard__stat-fill" 
                    data-level={sysInfo?.cpuLevel > 80 ? 'danger' : sysInfo?.cpuLevel > 50 ? 'warning' : 'normal'}
                    style={{ width: sysInfo?.cpuLevel ? `${sysInfo.cpuLevel}%` : '0%' }} 
                  />
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__stat-header">
                  <span className="dashboard__stat-label font-hud">MEMORY</span>
                  <span className="dashboard__stat-value">{sysInfo?.freeMemory ? `${sysInfo.freeMemory} FREE` : '—'}</span>
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__stat-header">
                  <span className="dashboard__stat-label font-hud">VOICE LINK</span>
                  <span className="dashboard__stat-value" style={{ color: isListening ? 'var(--cyan)' : 'var(--text-muted)' }}>
                    {isListening ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__stat-header">
                  <span className="dashboard__stat-label font-hud">HOST</span>
                  <span className="dashboard__stat-value" style={{ fontSize: '11px' }}>{sysInfo?.hostname || '—'}</span>
                </div>
              </div>
            </div>
            
            {/* Clear chat */}
            <button className="dashboard__clear-btn" onClick={clearMessages}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4" />
              </svg>
              CLEAR LOG
            </button>
          </section>

          {/* Center panel: HUD Orb */}
          <section className="dashboard__center-panel">
            <div className="dashboard__orb-wrap">
              <HUDOrb state={orbState} />
            </div>
          </section>

          {/* Right panel: Chat */}
          <section className="dashboard__chat-panel">
            <ChatPanel messages={messages} isLoading={isLoading} />
            <InputBar
              onSend={handleSend}
              onVoiceToggle={toggleListening}
              isListening={isListening}
              transcript={transcript}
            />
          </section>
        </main>
      </div>

      {/* Background grid overlay */}
      <div className="dashboard__grid-bg" aria-hidden="true" />
    </div>
  );
};

export default MainDashboard;
