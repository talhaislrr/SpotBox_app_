// src/services/config.js
// Bu dosya, uygulama genelinde kullanılacak olan yapılandırma ayarlarını içerir.
// API_URL gibi merkezi değişkenler burada tanımlanır.

// Environment-based API URL configuration
const getApiUrl = () => {
  // Development için IP adresi (React Native localhost'a erişemez)
  if (__DEV__) {
    return 'http://172.20.10.10:5001';
  }
  
  // Production için gerçek backend URL'i
  // Bu URL'i backend deploy ettikten sonra güncelle
  return 'https://your-production-backend.com';
};

export const API_URL = getApiUrl();

// App Store için gerekli diğer config'ler
export const APP_CONFIG = {
  // App Store için gerekli
  APP_NAME: 'SpotBox',
  VERSION: '1.0.0',
  
  // Network timeout ayarları
  REQUEST_TIMEOUT: 30000, // 30 saniye
  
  // Retry ayarları
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}; 