import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useWakeDetection from '../hooks/useWakeDetection';
import './LandingHUD.css';

/* ── Animated bar chart bars ── */
const BarChart = ({ bars = 28, color = '#00d4ff' }) => (
  <div className="hud2-bars">
    {Array.from({ length: bars }).map((_, i) => (
      <div
        key={i}
        className="hud2-bar"
        style={{
          '--h': `${Math.random() * 70 + 10}%`,
          '--delay': `${(i * 0.06).toFixed(2)}s`,
          '--color': color,
        }}
      />
    ))}
  </div>
);

/* ── Pie slice helper ── */
const PieSlice = ({ pct, color, offset = 0 }) => {
  const r = 40, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
      strokeDashoffset={-circ * offset}
      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
    />
  );
};

/* ── DNA strand ── */
const DNA = () => (
  <svg className="hud2-dna" viewBox="0 0 60 200">
    {Array.from({ length: 10 }).map((_, i) => {
      const y = i * 20 + 10;
      const cx = 30 + Math.sin(i * 0.8) * 20;
      return (
        <g key={i}>
          <circle cx={cx} cy={y} r="3" fill="#00d4ff" opacity="0.9" />
          <circle cx={60 - cx} cy={y} r="3" fill="#0066ff" opacity="0.9" />
          <line x1={cx} y1={y} x2={60 - cx} y2={y} stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        </g>
      );
    })}
  </svg>
);

const LandingHUD = () => {
  const navigate = useNavigate();
  const [wakeStatus, setWakeStatus] = useState('STANDBY');
  const [time, setTime] = useState(new Date());
  const [scanAngle, setScanAngle] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Radar sweep
  useEffect(() => {
    const t = setInterval(() => setScanAngle(a => (a + 2) % 360), 30);
    return () => clearInterval(t);
  }, []);

  // Wake Detection
  useWakeDetection(
    () => {
      setWakeStatus('ACTIVATING');
      setTimeout(() => {
        const isLoggedIn = localStorage.getItem('jarvis_auth');
        navigate(isLoggedIn ? '/' : '/login');
      }, 1400);
    },
    (micReady) => setWakeStatus(micReady ? 'LISTENING' : 'STANDBY'),
    { enabled: wakeStatus !== 'ACTIVATING' }
  );

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

  return (
    <div className="hud2-root">
      {/* ── Background grid ── */}
      <div className="hud2-grid-bg" />

      {/* ── Floating particles ── */}
      <div className="hud2-particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="hud2-particle" style={{
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--d': `${Math.random() * 8 + 3}s`,
            '--s': `${Math.random() * 2 + 1}px`,
          }} />
        ))}
      </div>

      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <div className="hud2-topbar">
        <div className="hud2-topbar-left">
          <span className="hud2-label">SYS.STATUS</span>
          <div className="hud2-dots">
            {[1,1,1,1,0,1,1,0,1,1,1,0].map((on, i) => (
              <div key={i} className={`hud2-dot ${on ? 'hud2-dot--on' : ''}`} />
            ))}
          </div>
          {!isOnline && <span className="hud2-label" style={{ color: 'var(--red)', marginLeft: '10px' }}>OFFLINE MODE</span>}
        </div>
        <div className="hud2-topbar-center">
          <span className="hud2-label hud2-label--bright">99%</span>
          <div className="hud2-tiny-dots">
            {Array.from({length:20}).map((_,i) => <div key={i} className="hud2-tiny-dot" />)}
          </div>
          <div className="hud2-label hud2-blink">◉</div>
        </div>
        <div className="hud2-topbar-right">
          <span className="hud2-label">HUD INTERFACE TECHNOLOGY</span>
          <div className="hud2-top-lines">
            {[1,0.7,0.5,0.3].map((w,i) => <div key={i} className="hud2-top-line" style={{ width: `${w*100}%` }} />)}
          </div>
        </div>
      </div>

      {/* ══ LEFT PANEL ═══════════════════════════════════════════════ */}
      <div className="hud2-panel hud2-panel--left">
        {/* DNA */}
        <div className="hud2-panel-box hud2-dna-box">
          <div className="hud2-panel-title">BIO SCAN</div>
          <div className="hud2-dna-wrap">
            <DNA />
            <div className="hud2-human-icon">
              <svg viewBox="0 0 30 60" fill="none" stroke="#00aaff" strokeWidth="1.5">
                <circle cx="15" cy="6" r="5" />
                <line x1="15" y1="11" x2="15" y2="38" />
                <line x1="5" y1="20" x2="25" y2="20" />
                <line x1="15" y1="38" x2="7" y2="56" />
                <line x1="15" y1="38" x2="23" y2="56" />
              </svg>
            </div>
          </div>
          <div className="hud2-wave-wrap">
            <svg className="hud2-wave" viewBox="0 0 120 30">
              <polyline points="0,15 10,8 20,20 30,5 40,22 50,12 60,18 70,6 80,24 90,10 100,16 110,8 120,15"
                fill="none" stroke="#00d4ff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Status rows */}
        <div className="hud2-panel-box">
          <div className="hud2-panel-title">SYS METRICS</div>
          {['CPU', 'MEM', 'NET', 'DSK'].map((label, i) => (
            <div key={label} className="hud2-metric-row">
              <span className="hud2-metric-label">{label}</span>
              <div className="hud2-metric-bar">
                <div className="hud2-metric-fill" style={{ '--w': `${[72, 48, 91, 34][i]}%`, '--delay': `${i * 0.2}s` }} />
              </div>
              <span className="hud2-metric-val">{[72, 48, 91, 34][i]}%</span>
            </div>
          ))}
        </div>

        {/* Bottom bars */}
        <div className="hud2-panel-box">
          <BarChart bars={18} color="#0066ff" />
        </div>
      </div>

      {/* ══ CENTER HUD ═══════════════════════════════════════════════ */}
      <div className="hud2-center">

        {/* Rotating rings */}
        <div className="hud2-rings">
          {/* Outer arc segments */}
          <svg className="hud2-ring-svg hud2-ring-svg--outer" viewBox="0 0 400 400">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Radar sweep sector */}
            <path
              d={`M200,200 L${200 + 170 * Math.cos((scanAngle - 60) * Math.PI / 180)},${200 + 170 * Math.sin((scanAngle - 60) * Math.PI / 180)} A170,170 0 0,1 ${200 + 170 * Math.cos(scanAngle * Math.PI / 180)},${200 + 170 * Math.sin(scanAngle * Math.PI / 180)} Z`}
              fill="rgba(0,180,255,0.08)"
              stroke="none"
            />
            <line
              x1="200" y1="200"
              x2={200 + 170 * Math.cos(scanAngle * Math.PI / 180)}
              y2={200 + 170 * Math.sin(scanAngle * Math.PI / 180)}
              stroke="rgba(0,220,255,0.6)" strokeWidth="1.5" filter="url(#glow)"
            />
            {/* Concentric circles */}
            {[170, 140, 110, 80, 55, 30].map((r, i) => (
              <circle key={r} cx="200" cy="200" r={r}
                fill="none" stroke={i === 0 ? 'rgba(0,200,255,0.6)' : 'rgba(0,160,255,0.25)'}
                strokeWidth={i === 0 ? 1.5 : 1}
                strokeDasharray={i % 2 === 0 ? 'none' : '4 3'}
              />
            ))}
            {/* Arc segments outer */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path key={i}
                d={`M${200 + 170 * Math.cos((angle) * Math.PI / 180)},${200 + 170 * Math.sin((angle) * Math.PI / 180)} A170,170 0 0,1 ${200 + 170 * Math.cos((angle + 45) * Math.PI / 180)},${200 + 170 * Math.sin((angle + 45) * Math.PI / 180)}`}
                fill="none" stroke="rgba(0,200,255,0.8)" strokeWidth="3"
                filter="url(#glow)"
              />
            ))}
            {/* Cross-hairs */}
            <line x1="30" y1="200" x2="370" y2="200" stroke="rgba(0,160,255,0.15)" strokeWidth="1" />
            <line x1="200" y1="30" x2="200" y2="370" stroke="rgba(0,160,255,0.15)" strokeWidth="1" />
            {/* Dots on rings */}
            {[0, 90, 180, 270].map(a => (
              <circle key={a} cx={200 + 170 * Math.cos(a * Math.PI / 180)} cy={200 + 170 * Math.sin(a * Math.PI / 180)}
                r="4" fill="#00d4ff" filter="url(#glow)" />
            ))}
          </svg>

          {/* Spinning ring 1 */}
          <div className="hud2-spin hud2-spin--cw hud2-spin--r1">
            <svg viewBox="0 0 260 260">
              <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(0,180,255,0.3)" strokeWidth="1" strokeDasharray="8 4" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                <circle key={a} cx={130 + 120 * Math.cos(a * Math.PI / 180)} cy={130 + 120 * Math.sin(a * Math.PI / 180)} r="3" fill="#00aaff" />
              ))}
            </svg>
          </div>

          {/* Spinning ring 2 */}
          <div className="hud2-spin hud2-spin--ccw hud2-spin--r2">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,220,255,0.4)" strokeWidth="2" strokeDasharray="20 8" />
            </svg>
          </div>

          {/* Spinning ring 3 */}
          <div className="hud2-spin hud2-spin--cw hud2-spin--r3" style={{ animationDuration: '4s' }}>
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(0,180,255,0.5)" strokeWidth="2" strokeDasharray="12 6" />
            </svg>
          </div>

          {/* Center core */}
          <div className="hud2-core">
            <div className="hud2-core-ring hud2-core-ring--1" />
            <div className="hud2-core-ring hud2-core-ring--2" />
            <div className="hud2-core-orb" />
          </div>

          {/* Angled corner brackets */}
          {['tl', 'tr', 'bl', 'br'].map(pos => (
            <div key={pos} className={`hud2-bracket hud2-bracket--${pos}`}>
              <svg viewBox="0 0 80 80" fill="none" stroke="rgba(0,200,255,0.7)" strokeWidth="2">
                {pos.includes('t') ? (
                  <>
                    <line x1="0" y1="0" x2="80" y2="0" />
                    <line x1="0" y1="0" x2="0" y2="40" />
                  </>
                ) : (
                  <>
                    <line x1="0" y1="80" x2="80" y2="80" />
                    <line x1="0" y1="80" x2="0" y2="40" />
                  </>
                )}
              </svg>
            </div>
          ))}
        </div>

        {/* Clock overlay */}
        <div className="hud2-clock-overlay">
          <div className="hud2-time">{fmt(time)}</div>
          <div className="hud2-date">{fmtDate(time)}</div>
          <div className="hud2-label hud2-label--center">J.A.R.V.I.S OS v3.1</div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══════════════════════════════════════════════ */}
      <div className="hud2-panel hud2-panel--right">
        {/* Hex stats */}
        <div className="hud2-panel-box">
          <div className="hud2-panel-title">ANALYSIS</div>
          <div className="hud2-hex-grid">
            {['AI', 'NET', 'SEC'].map((label, i) => (
              <div key={label} className="hud2-hex">
                <svg viewBox="0 0 60 70">
                  <polygon points="30,2 58,17 58,53 30,68 2,53 2,17" fill="rgba(0,100,200,0.2)" stroke="#00aaff" strokeWidth="1.5" />
                  <text x="30" y="36" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="Orbitron">{label}</text>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Mini dials */}
        <div className="hud2-panel-box">
          <div className="hud2-panel-title">CORE STATUS</div>
          {[{ label: 'POWER', val: 75, color: '#00d4ff' }, { label: 'SHIELD', val: 62, color: '#0088ff' }].map(({ label, val, color }) => (
            <div key={label} className="hud2-dial-row">
              <svg viewBox="0 0 44 44" className="hud2-mini-dial">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,80,150,0.4)" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
                  strokeDasharray={`${113 * val / 100} 113`}
                  strokeDashoffset="28"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', filter: `drop-shadow(0 0 4px ${color})` }}
                />
                <text x="22" y="26" textAnchor="middle" fill={color} fontSize="8" fontFamily="Orbitron">{val}%</text>
              </svg>
              <span className="hud2-label">{label}</span>
            </div>
          ))}
          <div className="hud2-label hud2-small-label">0.282517</div>
        </div>

        {/* City skyline */}
        <div className="hud2-panel-box hud2-city-box">
          <svg viewBox="0 0 100 60" className="hud2-city">
            {[
              [5,20,8,40],[15,10,8,50],[25,30,6,30],[33,15,10,45],[45,5,12,55],
              [59,18,8,42],[69,8,10,52],[81,25,7,35],[90,12,10,48]
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="#0066ff" strokeWidth="0.8" opacity="0.7" />
            ))}
            {/* windows */}
            {[
              [47,15],[50,20],[57,25],[61,28],[70,18],[73,22],[82,33]
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="2" height="2" fill="#00aaff" opacity="0.6" />
            ))}
          </svg>
          <div className="hud2-panel-title" style={{ marginTop: 4 }}>SECTOR MAP</div>
        </div>
      </div>

      {/* ══ BOTTOM AREA ══════════════════════════════════════════════ */}
      <div className="hud2-bottom">
        {/* Left bottom - circles row */}
        <div className="hud2-bottom-left">
          <div className="hud2-label">NODES</div>
          <div className="hud2-circle-row">
            {[1,1,1,1,0,0,0,1,1].map((on, i) => (
              <div key={i} className={`hud2-circ ${on ? 'hud2-circ--on' : ''}`} />
            ))}
          </div>
          <div className="hud2-circle-row">
            {[...Array(6)].map((_, i) => <div key={i} className="hud2-circ hud2-circ--ring" />)}
          </div>
        </div>

        {/* Center bottom - pie + mini icons */}
        <div className="hud2-bottom-center">
          <svg viewBox="0 0 100 100" className="hud2-pie">
            <circle cx="50" cy="50" r="40" fill="rgba(0,30,80,0.5)" stroke="rgba(0,100,200,0.3)" strokeWidth="1" />
            <PieSlice pct={0.35} color="#00d4ff" offset={0} />
            <PieSlice pct={0.25} color="#0066ff" offset={0.35} />
            <PieSlice pct={0.20} color="#004499" offset={0.60} />
            <PieSlice pct={0.20} color="rgba(0,100,200,0.3)" offset={0.80} />
          </svg>
          <div className="hud2-mini-icons">
            {['◎','⊕','◈','◉','⊗'].map((ic, i) => (
              <span key={i} className="hud2-mini-icon">{ic}</span>
            ))}
          </div>
          <BarChart bars={24} color="#00d4ff" />
        </div>

        {/* Right bottom - bar chart */}
        <div className="hud2-bottom-right">
          <div className="hud2-label">SIGNAL</div>
          <BarChart bars={22} color="#0088ff" />
        </div>
      </div>

      {/* ══ WAKE INDICATOR ══════════════════════════════════════════ */}
      <div className="hud2-wake">
        <div className={`hud2-wake-dot hud2-wake-dot--${wakeStatus.toLowerCase()}`} />
        <span className="hud2-wake-text">
          {wakeStatus === 'LISTENING'  ? (isOnline ? '🎙  SAY "HEY JARVIS" TO ACTIVATE' : '🎙  OFFLINE: CLAP OR MAKE LOUD NOISE TO ACTIVATE')
          : wakeStatus === 'ACTIVATING' ? '⚡  ACTIVATING J.A.R.V.I.S ...'
          :                               '⏸  ALLOW MICROPHONE ACCESS TO ENABLE WAKE'}
        </span>
      </div>
    </div>
  );
};

export default LandingHUD;
