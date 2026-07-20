import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    id: 'chat',
    path: '/',
    label: 'CHAT',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'CONFIG',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'screensaver',
    path: '/screensaver',
    label: 'HUD',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session — user must log in again next time
      sessionStorage.removeItem('jarvis_auth');
      navigate('/login');
    }
  };

  return (
    <nav className="sidebar glass">
      {/* Top logo mark */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-orb" />
      </div>

      {/* Nav items */}
      <ul className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <li key={item.id}>
              <button
                className={`sidebar__nav-btn ${active ? 'sidebar__nav-btn--active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="sidebar__nav-label font-hud">{item.label}</span>
                {active && <span className="sidebar__active-bar" />}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom indicator / Logout */}
      <div className="sidebar__footer" style={{ paddingBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="sidebar__nav-btn"
          onClick={handleLogout}
          title="LOGOUT"
          style={{ padding: '0.75rem', background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
        >
          <span className="sidebar__nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="sidebar__nav-label font-hud" style={{ fontSize: '0.65rem', opacity: 0.8 }}>LOGOUT</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
