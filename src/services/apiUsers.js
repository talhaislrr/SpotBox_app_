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
/**
 * Kullanıcının arkadaş listesini getirir.
 * @returns {Promise<Array>} Arkadaş kullanıcı objeleri
 */
export const getMyFriends = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Yetkilendirme tokenı bulunamadı.');
    }

    const response = await fetch(`${API_URL}/api/users/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Arkadaş listesi alınamadı.');
    }

    const friends = await response.json();
    return friends;
  } catch (error) {
    console.error('Arkadaş listesi hatası:', error);
    throw error;
  }
};
/**
 * Kullanıcıya gelen arkadaşlık isteklerini getirir.
 * @returns {Promise<Array<{id:string,name:string}>>}
 */
export const getFriendRequests = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Yetkilendirme tokenı bulunamadı.');

    const response = await fetch(`${API_URL}/api/friend-requests`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'İstekler alınamadı.');
    }
    const data = await response.json();
    // API'den gelen her istek objesi: { _id, from: { name, username, _id } }
    return data.map((r) => ({ id: r._id, name: r.from.name }));
  } catch (error) {
    console.error('Arkadaşlık istekleri hatası:', error);
    throw error;
  }
};

/**
 * Belirtilen arkadaşlık isteğini kabul eder.
 */
export const acceptFriendRequest = async (requestId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Yetkilendirme tokenı bulunamadı.');
    const response = await fetch(`${API_URL}/api/friend-requests/${requestId}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'İstek kabul edilemedi.');
    }
  } catch (error) {
    console.error('İstek kabul hatası:', error);
    throw error;
  }
};

/**
 * Belirtilen arkadaşlık isteğini reddeder.
 */
export const rejectFriendRequest = async (requestId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Yetkilendirme tokenı bulunamadı.');
    const response = await fetch(`${API_URL}/api/friend-requests/${requestId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'İstek reddedilemedi.');
    }
  } catch (error) {
    console.error('İstek reddetme hatası:', error);
    throw error;
  }
};
/**
 * Belirtilen kullanıcıya arkadaşlık isteği gönderir.
 * @param {string} toUserId - İstek gönderilecek kullanıcı ID'si
 */
export const sendFriendRequest = async (toUserId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Yetkilendirme tokenı bulunamadı.');

    const response = await fetch(`${API_URL}/api/friend-requests/${toUserId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'İstek gönderilemedi.');
    }
  } catch (error) {
    console.error('Arkadaşlık isteği gönderme hatası:', error);
    throw error;
  }
}; 