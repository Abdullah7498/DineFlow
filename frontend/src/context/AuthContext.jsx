import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => {
    const raw = localStorage.getItem('dineflow_session');
    return raw ? JSON.parse(raw) : null;
  });

  const setSession = (nextSession) => {
    if (nextSession) {
      localStorage.setItem('dineflow_session', JSON.stringify(nextSession));
      localStorage.setItem('dineflow_token', nextSession.token);
    } else {
      localStorage.removeItem('dineflow_session');
      localStorage.removeItem('dineflow_token');
    }

    setSessionState(nextSession);
  };

  const value = useMemo(() => ({
    session,
    user: session?.user,
    isAuthenticated: Boolean(session?.token),
    setSession,
    logout: () => setSession(null),
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
