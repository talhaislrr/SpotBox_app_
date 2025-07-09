import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, logout as apiLogout } from '../services/apiAuth';

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const u = userJson ? JSON.parse(userJson) : null;
        setUser(u);
      } catch (err) {
        console.error('AsyncStorage error:', err);
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email, password) => {
    const u = await login(email, password);
    setUser(u);
    return u;
  };
  const signUp = async (email, password, username) => {
    const u = await register(email, password, username);
    setUser(u);
    return u;
  };
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 