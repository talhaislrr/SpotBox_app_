// Polyfills for React Native storage SDK
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";
import * as FileSystem from 'expo-file-system';

const storage = getStorage(app);

/**
 * Converts a local file URI to a Blob, compatible with firebase/storage.
 */
async function uriToBlob(uri) {
  if (uri.startsWith('file://')) {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const dataUri = `data:image/jpeg;base64,${base64}`;
    const response = await fetch(dataUri);
    return await response.blob();
  }
  const response = await fetch(uri);
  return await response.blob();
}

/**
 * Uploads a local file URI to Firebase Storage and returns its download URL.
 * @param {string} uri - Local file URI
 * @param {string} path - Storage path (e.g., 'boxes/<id>/front.jpg')
 * @returns {Promise<string>} - Download URL
 */
export const uploadImageAsync = async (uri, path) => {
  const blob = await uriToBlob(uri);
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  // Wait for upload to complete
  await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      null,
      (error) => reject(error),
      () => resolve()
    );
  });

  return await getDownloadURL(storageRef);
}; 