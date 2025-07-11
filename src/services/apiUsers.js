import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

/**
 * Mevcut kullanıcının profil bilgilerini günceller.
 * @param {object} updatedData - Güncellenecek kullanıcı verileri (name, email, username).
 * @returns {Promise<object>} - Güncellenmiş kullanıcı bilgileri.
 */
export const updateMyProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Yetkilendirme tokenı bulunamadı.');
    }

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Profil güncellenemedi.');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    throw error;
  }
}; 