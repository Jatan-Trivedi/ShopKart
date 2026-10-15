import { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const data = await apiClient('/profile');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const data = await apiClient('/login', {
      method: 'POST',
      body: { email, password },
    });
    
    await checkAuthStatus();
    return data;
  };

  const register = async (userData) => {
    const data = await apiClient('/register', {
      method: 'POST',
      body: userData,
    });
    await checkAuthStatus();
    return data;
  };

  const logout = async () => {
    await apiClient('/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};