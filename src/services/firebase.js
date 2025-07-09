import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { initializeFirestore, collection, getDocs, addDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Firebase konfigürasyonu
export const firebaseConfig = {
  apiKey: 'AIzaSyDD7--S3zGrKrvQ_oTFQ-INPvcJ6v8jV1s',
  authDomain: 'spotbox-4c9ca.firebaseapp.com',
  projectId: 'spotbox-4c9ca',
  storageBucket: 'spotbox-4c9ca.firebasestorage.app',
  messagingSenderId: '1065700795188',
  appId: '1:1065700795188:web:ce4ed4b9cd6b6358a87b61',
  measurementId: 'G-60DCWHQ98Z',
};

// Firebase initialize
export const app = initializeApp(firebaseConfig);
// Initialize Auth with AsyncStorage persistence, fallback if already initialized
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (err) {
  console.warn('Auth already initialized, using getAuth fallback');
  auth = getAuth(app);
}
export { auth };
// Analytics
analyticsIsSupported()
  .then(supported => {
    if (supported) {
      getAnalytics(app);
    } else {
      console.warn('Analytics not supported in this environment');
    }
  })
  .catch(err => console.warn('Analytics initialization error:', err));
// Firestore with long-polling for React Native
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
const boxesCollection = collection(db, 'boxes');

export const getBoxes = async () => {
  const snapshot = await getDocs(boxesCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    let timestamp;
    if (data.timestamp && typeof data.timestamp.toDate === 'function') {
      timestamp = data.timestamp.toDate();
    } else if (data.timestamp) {
      // timestamp string veya number ise Date nesnesine dönüştür
      timestamp = new Date(data.timestamp);
    } else {
      timestamp = null;
    }
    return { id: doc.id, ...data, timestamp };
  });
};

export const createBox = async (box) => {
  const docRef = await addDoc(boxesCollection, {
    location: box.location,
    photos: box.photos,
    timestamp: serverTimestamp(),
    userId: box.userId,
    username: box.username,
  });
  const savedDoc = await getDoc(docRef);
  return { id: savedDoc.id, ...savedDoc.data(), timestamp: savedDoc.data().timestamp.toDate() };
};

export default { getBoxes, createBox }; 