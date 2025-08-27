import CryptoJS from 'crypto-js';

// Generate a consistent encryption key based on user's browser fingerprint
const generateEncryptionKey = (): string => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  
  return CryptoJS.SHA256(fingerprint).toString();
};

// Add timestamp and expiry to stored data
interface SecureStorageData {
  data: any;
  timestamp: number;
  expiry: number;
}

// Encrypt and store data with automatic expiry
export const setSecureItem = (key: string, data: any, expiryDays: number = 30): void => {
  try {
    const encryptionKey = generateEncryptionKey();
    const now = Date.now();
    const expiry = now + (expiryDays * 24 * 60 * 60 * 1000); // Convert days to ms
    
    const storageData: SecureStorageData = {
      data,
      timestamp: now,
      expiry
    };
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(storageData), encryptionKey).toString();
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Error storing secure data:', error);
    // Fallback to regular storage without encryption if crypto fails
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Decrypt and retrieve data, checking expiry
export const getSecureItem = <T>(key: string): T | null => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;
    
    const encryptionKey = generateEncryptionKey();
    
    try {
      // Try to decrypt first
      const decryptedBytes = CryptoJS.AES.decrypt(storedData, encryptionKey);
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      const parsedData: SecureStorageData = JSON.parse(decryptedData);
      
      // Check if data has expired
      if (Date.now() > parsedData.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsedData.data as T;
    } catch (cryptoError) {
      // If decryption fails, try to parse as regular JSON (backwards compatibility)
      try {
        return JSON.parse(storedData) as T;
      } catch (jsonError) {
        console.error('Error parsing stored data:', jsonError);
        localStorage.removeItem(key); // Remove corrupted data
        return null;
      }
    }
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

// Remove stored data securely
export const removeSecureItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing secure data:', error);
  }
};

// Clean up expired items
export const cleanupExpiredItems = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const item = getSecureItem(key);
      if (item === null && localStorage.getItem(key) !== null) {
        // Item was expired and removed by getSecureItem
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
  }
};

// Initialize cleanup on page load
if (typeof window !== 'undefined') {
  // Run cleanup when the module loads
  cleanupExpiredItems();
  
  // Set up periodic cleanup every hour
  setInterval(cleanupExpiredItems, 60 * 60 * 1000);
}