import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Auth API client for SpotBox backend
// API_URL merkezi config dosyasından geliyor

/**
 * Yeni kullanıcı kaydı yapar.
 * @param {string} name - Kullanıcının tam adı.
 * @param {string} email - Kullanıcının e-posta adresi.
 * @param {string} username - Kullanıcının adı.
 * @param {string} password - Kullanıcının şifresi.
 */
export const register = async (name, email, username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, username, password }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => {});
      throw new Error(err.message || 'Register failed');
    }
    const { token, user } = await response.json();
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Logs in an existing user via backend API and stores token/user in AsyncStorage.
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => {});
    throw new Error(err.message || 'Login failed');
  }
  const { token, user } = await response.json();
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
};

/**
 * Logs out the current user by clearing AsyncStorage.
 */
export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

/**
 * Fetches current authenticated user profile from backend
 */
export const getProfile = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Profil verisi alınamadı');
  }
  return await response.json();
}; 