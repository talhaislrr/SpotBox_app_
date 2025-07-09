import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Konuşma oluşturma veya var olanı getir
export const createConversation = async (participantId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ participantId }),
  });
  if (!response.ok) throw new Error('Konuşma oluşturulamadı');
  return await response.json();
};

// Kullanıcının konuşmalarını al
export const getConversations = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Konuşmalar alınamadı');
  return await response.json();
};

// Bir konuşmadaki mesajları al
export const getMessages = async (conversationId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/chats/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Mesajlar alınamadı');
  return await response.json();
};

// Mesaj gönder
export const sendMessageApi = async (conversationId, text) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/chats/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Mesaj gönderilemedi');
  return await response.json();
}; 