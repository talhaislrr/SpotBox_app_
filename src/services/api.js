import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// REST API client for SpotBox backend
// API_URL merkezi config dosyasından geliyor

export const getBoxes = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/boxes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Boxes fetch error');
  }
  return await response.json();
};

export const createBox = async (box) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/boxes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(box),
  });
  if (!response.ok) {
    throw new Error('Box creation error');
  }
  return await response.json();
};

export const deleteAllBoxes = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/boxes`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Boxes delete error');
  }
  return await response.json();
}; 