import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate state from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('tp_token');
      const storedUser = localStorage.getItem('tp_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('tp_token');
      localStorage.removeItem('tp_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const persistSession = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('tp_token', token);
    localStorage.setItem('tp_user', JSON.stringify(user));
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/signup', { username, email, password });
    persistSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
