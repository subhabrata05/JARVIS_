import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';
import './LoginPage.css';

const LoginPage = () => {
  const [view, setView] = useState('LOGIN'); // LOGIN | REGISTER
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const goToApp = () => navigate(from, { replace: true });

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showError('Please fill in all fields.');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('jarvis_auth', 'true');
        goToApp();
      } else {
        showError('Access denied. Invalid credentials.');
      }
    } catch {
      showError('Unable to connect to server.');
    }
    setLoading(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) return showError('Please fill in all fields.');
    if (password !== confirmPassword) return showError('Passwords do not match.');
    if (!agreeTerms) return showError('You must agree to the Terms & Conditions.');
    sessionStorage.setItem('jarvis_auth', 'true');
    goToApp();
  };

  const handleSocial = async (providerName) => {
    const provider = providerName === 'Google' ? googleProvider : appleProvider;
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        sessionStorage.setItem('jarvis_auth', 'true');
        goToApp();
      }
    } catch (err) {
      showError(`${providerName} sign-in failed. Check Firebase Console.`);
      console.error(err);
    }
    setLoading(false);
  };

  const handleGuestAccess = () => {
    sessionStorage.setItem('jarvis_auth', 'true');
    goToApp();
  };

  return (
    <div className="lp-root">
      {/* Animated background nodes */}
      <div className="lp-bg">
        <div className="lp-bg__glow lp-bg__glow--left" />
        <div className="lp-bg__glow lp-bg__glow--right" />
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="lp-node"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--d': `${Math.random() * 6 + 2}s`,
              '--s': `${Math.random() * 3 + 2}px`,
            }}
          />
        ))}
        <svg className="lp-bg__lines" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[...Array(15)].map((_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`} y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`} y2={`${Math.random() * 100}%`}
              stroke="rgba(0,160,255,0.12)" strokeWidth="1" filter="url(#glow)"
            />
          ))}
        </svg>
        {/* Neural brain silhouette */}
        <div className="lp-brain" />
      </div>

      <div className="lp-wrap">
        {/* Logo */}
        <div className="lp-logo">
          <div className="lp-logo__badge">
            <span>AI</span>
          </div>
          <span className="lp-logo__text">JARVIS <strong>AI</strong></span>
        </div>

        {/* Card */}
        <div className={`lp-card ${error ? 'lp-card--error' : ''}`}>
          {view === 'LOGIN' ? (
            <form className="lp-form" onSubmit={handleLogin}>
              <h2 className="lp-form__title">Welcome Back</h2>
              <p className="lp-form__subtitle">Sign in to Jarvis AI</p>

              <div className="lp-field">
                <span className="lp-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="lp-field">
                <span className="lp-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="lp-field__eye" onClick={() => setShowPassword(v => !v)}>
                  {showPassword
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              <div className="lp-row">
                <label className="lp-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  <span>Remember Me</span>
                </label>
                <button type="button" className="lp-link">Forgot Password?</button>
              </div>

              {error && <div className="lp-error">{error}</div>}

              <button type="submit" className="lp-btn lp-btn--primary" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : 'Sign in to Jarvis AI'}
              </button>

              <div className="lp-divider"><span>Or continue with</span></div>

              <div className="lp-social-row">
                <button type="button" className="lp-social-btn" onClick={() => handleSocial('Google')}>
                  <svg className="lp-social-btn__icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <button type="button" className="lp-social-btn" onClick={() => handleSocial('Apple')}>
                  <svg className="lp-social-btn__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                  Continue with Apple
                </button>
              </div>

              <p className="lp-switch">
                Don't have an account?{' '}
                <button type="button" className="lp-link" onClick={() => setView('REGISTER')}>Sign up</button>
              </p>

              <button type="button" className="lp-guest-btn" onClick={handleGuestAccess}>
                Emergency Guest Access
              </button>
            </form>
          ) : (
            <form className="lp-form" onSubmit={handleRegister}>
              <h2 className="lp-form__title">Create Account</h2>
              <p className="lp-form__subtitle">Sign up to Jarvis AI</p>

              <div className="lp-field">
                <span className="lp-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="lp-field">
                <span className="lp-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="lp-field__eye" onClick={() => setShowPassword(v => !v)}>
                  {showPassword
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              <div className="lp-field">
                <span className="lp-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="lp-field__eye" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              <label className="lp-checkbox lp-checkbox--full">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                <span>I agree to the <button type="button" className="lp-link">Terms &amp; Conditions</button> and <button type="button" className="lp-link">Privacy Policy</button></span>
              </label>

              {error && <div className="lp-error">{error}</div>}

              <button type="submit" className="lp-btn lp-btn--primary" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : 'Sign up to Jarvis AI'}
              </button>

              <div className="lp-divider"><span>Or continue with</span></div>

              <div className="lp-social-row">
                <button type="button" className="lp-social-btn" onClick={() => handleSocial('Google')}>
                  <svg className="lp-social-btn__icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <button type="button" className="lp-social-btn" onClick={() => handleSocial('Apple')}>
                  <svg className="lp-social-btn__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                  Continue with Apple
                </button>
              </div>

              <p className="lp-switch">
                Already have an account?{' '}
                <button type="button" className="lp-link" onClick={() => setView('LOGIN')}>Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
