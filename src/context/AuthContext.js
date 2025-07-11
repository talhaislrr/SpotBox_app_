import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, logout as apiLogout, getProfile } from '../services/apiAuth';

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, fetch profile from backend if token exists
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const u = await getProfile();
          setUser(u);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async (email, password) => {
    await login(email, password);
    const u = await getProfile();
    setUser(u);
    return u;
  };
  const signUp = async (name, email, password, username) => {
    await register(name, email, username, password);
    const u = await getProfile();
    setUser(u);
    return u;
  };
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 