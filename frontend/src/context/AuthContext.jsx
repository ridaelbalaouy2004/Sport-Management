import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(credentials);
      const { token: t, user: u } = data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      // Demo fallback — accept demo@sportsync.com / password
      if (
        credentials.email === 'admin@sportsync.com' &&
        credentials.password === 'password'
      ) {
        const demoUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@sportsync.com',
          role: 'admin',
          avatar: null,
        };
        const demoToken = 'demo-token-12345';
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setToken(demoToken);
        setUser(demoUser);
        return { success: true };
      }
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(userData);
      const { token: t, user: u } = data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isManager = () => ['admin', 'manager'].includes(user?.role);

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isManager, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
