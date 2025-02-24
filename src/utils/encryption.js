// utils/encryption.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'defaultSecretKey';

// Function to encrypt data
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  if (!encryptedData) return null;
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Function to store encrypted data in localStorage
export const setEncryptedItem = (key, data) => {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

// Function to get decrypted data from localStorage
export const getDecryptedItem = (key) => {
  const encryptedData = localStorage.getItem(key);
  return decryptData(encryptedData);
};

// Function to remove an item from localStorage
export const removeItem = (key) => {
  localStorage.removeItem(key);
};
