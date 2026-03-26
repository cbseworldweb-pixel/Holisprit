import React, { createContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAuthData = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    setError(null);
  }, []);

  const register = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        const response = await authApi.register({ name, email, password });
        const { user: userData, token: authToken } = response.data.data;
        saveAuthData(userData, authToken);
        return response.data;
      } catch (err) {
        const message = err.response?.data?.message || 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [saveAuthData]
  );

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const response = await authApi.login({ email, password });
        const { user: userData, token: authToken } = response.data.data;
        saveAuthData(userData, authToken);
        return response.data;
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [saveAuthData]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  const demoLogin = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authApi.demoLogin();
      const { user: userData, token: authToken } = response.data.data;
      saveAuthData(userData, authToken);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Demo login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveAuthData]);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    demoLogin,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
