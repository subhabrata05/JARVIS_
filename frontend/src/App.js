import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import SettingsPage from './pages/SettingsPage';
import LandingHUD from './pages/LandingHUD';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Step 1: Screensaver (default entry point) ── */}
        <Route path="/screensaver" element={<LandingHUD />} />

        {/* ── Step 2: Login / Authorization ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Step 3 & 4: Main app (protected) ── */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* ── Catch-all: redirect everything else to screensaver ── */}
        <Route path="*" element={<Navigate to="/screensaver" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
