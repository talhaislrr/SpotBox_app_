import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

/**
 * Belirtilen kullanıcıya arkadaşlık isteği gönderir.
 * @param {string} toUserId - Arkadaşlık isteği gönderilecek kullanıcı ID'si
 */
export const sendFriendRequest = async (toUserId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/friend-requests/${toUserId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const text = await response.text();
    console.error('FriendRequest Error:', response.status, text);
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = null; }
    const message = parsed?.message || text || 'Arkadaşlık isteği gönderilemedi';
    throw new Error(message);
  }
  return await response.json();
}; 