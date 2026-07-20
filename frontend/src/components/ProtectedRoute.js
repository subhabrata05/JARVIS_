import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute
 * If the user is not authenticated, sends them to /screensaver
 * (not /login directly — the screensaver is always the entry point per the roadmap).
 * Stores the intended path so we can redirect back after login.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('jarvis_auth') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to screensaver, carrying the original destination
    return <Navigate to="/screensaver" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
